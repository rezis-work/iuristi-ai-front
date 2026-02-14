# Password Reset Implementation Guide

## Overview
The password reset functionality is fully implemented on both backend and frontend with comprehensive error handling, rate limiting, and user feedback.

## Architecture

### Frontend Components

#### 1. **Request Password Reset** (`/reset-password`)
Path: `src/app/(auth)/reset-password/page.tsx`

- **Component**: `ResetPasswordForm` in `src/features/auth/components/reset-password-form.tsx`
- **Features**:
  - Email validation using Zod schema
  - Two-state UX (form input & success confirmation)
  - Success page shows email confirmation with helpful instructions
  - "Try Another Email" button for resending to different email
  - Back to Login button

**Form States**:
- Input form: Allows user to enter email
- Success state: Displays confirmation message with instructions
  - Email recipient shown
  - Instructions about reset link expiration (30 minutes)
  - Reminder to check spam folder
  - Information about cooldown period (60 seconds)

#### 2. **Confirm Password Reset** (`/confirm-password-reset?token=...`)
Path: `src/app/(auth)/confirm-password-reset/page.tsx`

- **Component**: `ConfirmPasswordResetForm` in `src/features/auth/components/confirm-password-reset-form.tsx`
- **Features**:
  - Token automatically extracted from URL parameters
  - Password validation (8+ chars, letter + number)
  - Confirm password field with real-time validation
  - Password requirements display
  - Error handling for invalid/expired tokens
  - Auto-redirect to login on success (1.5 second delay)

### API Integration

#### Request Password Reset
```
POST /auth/password-reset/request
Body: { email: string }
Response: { sent: boolean }
```

**Error Codes**:
- `RATE_LIMITED`: Too many requests (429)
- `PASSWORD_RESET_COOLDOWN`: Need to wait before resending (429)
- `PASSWORD_RESET_DAILY_LIMIT`: Daily limit exceeded (429)

#### Confirm Password Reset
```
POST /auth/password-reset/confirm
Body: { token: string, newPassword: string }
Response: { reset: boolean }
```

**Error Codes**:
- `INVALID_TOKEN`: Invalid or expired token (400)
- `RATE_LIMITED`: Too many requests (429)
- Validation errors for password requirements

### Hooks

#### `useRequestPasswordReset()`
Located: `src/features/auth/hook/use-password-reset.ts`

**Features**:
- Handles password reset request mutation
- Toast notifications for success/error
- Error code parsing and custom messages
- Distinguishes between:
  - Rate limiting (generic message)
  - Cooldown period (with wait time)
  - Daily limit (with "try again tomorrow")

**Success Handling**:
```javascript
toast.success("Password reset email sent!", {
  description: `We've sent a reset link to ${email}. Please check your inbox and spam folder.`,
});
```

#### `useConfirmPasswordReset()`
Located: `src/features/auth/hook/use-password-reset.ts`

**Features**:
- Handles password reset confirmation mutation
- Removes `confirmPassword` field before API call (frontend-only validation)
- Auto-redirect to login after success
- Custom error messages for:
  - Invalid/expired tokens
  - Password mismatch
  - Validation errors
  - Rate limiting

**Success Handling**:
```javascript
toast.success("Password reset successful!", {
  description: "You can now log in with your new password.",
});
// Redirects to /login after 1.5 seconds
```

### Validation Schemas

Located: `src/features/auth/schemas/password-reset-schemas.ts`

```typescript
// Request Password Reset
const requestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Confirm Password Reset
const confirmPasswordResetSchema = z.object({
  token: z.string().min(10, "Invalid reset token"),
  newPassword: passwordSchema, // 8+ chars, letter + number
  confirmPassword: passwordSchema,
}).refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);
```

## User Flow

### 1. Request Password Reset
```
User → Click "Forgot Password" →
  ↓
Enter email address →
  ↓
Click "Send Reset Link" →
  ↓
Check "Confirm email sent" UI →
  ↓
Go to inbox and click link
```

### 2. Confirm Password Reset
```
Click email link (contains token) →
  ↓
Form pre-fills token from URL →
  ↓
Enter new password (8+ chars, letter + number) →
  ↓
Confirm password must match →
  ↓
Click "Reset Password" →
  ↓
Success message → Auto-redirect to login
```

### 3. Error Handling

#### During Request
- **"Too many requests"**: User exceeded rate limit (wait a few moments)
- **"Please wait..."**: Cooldown period active (wait 60+ seconds)
- **"Daily limit reached"**: Max 5 requests per day exceeded (try tomorrow)
- **"Failed to send reset email"**: Generic backend error

#### During Confirmation
- **"Invalid or expired reset link"**: Token invalid/expired (request new reset)
- **"Too many requests"**: Rate limit exceeded (wait a few moments)
- **"Passwords don't match"**: Ensure both fields match
- **"Invalid password"**: Doesn't meet requirements (8+ chars, letter + number)

## Security Features

### Backend Implementation
- ✅ Email enumeration prevention (always returns `{ sent: true }`)
- ✅ Token hashing with SHA256
- ✅ Token expiration (30 minutes default)
- ✅ Rate limiting per IP (5 requests/hour for request, 10 requests/10 min for confirm)
- ✅ Cooldown between requests (60 seconds minimum)
- ✅ Daily limit (5 requests per day)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Token one-time use (marked as `usedAt`)
- ✅ Refresh token revocation after reset (forces re-login everywhere)
- ✅ Event publishing for audit trail

### Frontend Implementation
- ✅ Password validation (8+ chars, letter + number)
- ✅ Client-side validation before API calls
- ✅ Secure URL parameter handling
- ✅ Token extraction from email links
- ✅ No password logging or storage
- ✅ Automatic session timeout on unexpected errors

## Testing Checklist

### Manual Testing
- [ ] Request password reset with valid email
- [ ] Verify email received (check spam folder)
- [ ] Click email link with token
- [ ] Confirm password field auto-fills token
- [ ] Enter password with invalid requirements (< 8 chars)
- [ ] Error message displays correctly
- [ ] Enter valid password (8+ chars, letter + number)
- [ ] Confirm password matches
- [ ] Click reset button
- [ ] Success message displays
- [ ] Auto-redirect to login occurs
- [ ] Can login with new password

### Error Scenarios
- [ ] Request reset too quickly (test cooldown)
- [ ] Request reset 5+ times in 24h (test daily limit)
- [ ] Use invalid/expired token
- [ ] Use already-used token (one-time use)
- [ ] Request with non-existent email (should show success)
- [ ] Poor network connection (error handling)

### Edge Cases
- [ ] Token from old email link after many requests
- [ ] Password reset with special characters
- [ ] Very long password (near 72 char limit)
- [ ] Simultaneous reset requests
- [ ] Reset link shared with multiple people

## Configuration

### Environment Variables
None required - all defaults are reasonable.

### Backend Environment Variables (for reference)
```
PASSWORD_RESET_TOKEN_EXPIRES_MIN=30        # Token expiration
PASSWORD_RESET_RESEND_COOLDOWN_SEC=60      # Between requests
PASSWORD_RESET_MAX_DAILY=5                 # Daily limit
RATE_LIMIT_ENABLED=true                    # Rate limiting
RESEND_API_KEY=...                         # Email service
```

## API Response Examples

### Successful Request
```json
{
  "sent": true
}
```

### Successful Confirmation
```json
{
  "reset": true
}
```

### Error Response (Rate Limited)
```json
{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please wait a moment.",
    "requestId": "uuid"
  }
}
```

### Error Response (Invalid Token)
```json
{
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired password reset token",
    "requestId": "uuid"
  }
}
```

## Component Integration Points

### Links in App
```html
<!-- Login page should have "Forgot Password" link -->
<Link href="/reset-password">Forgot Password?</Link>

<!-- Or in navigation/footer -->
<Link href="/reset-password">Reset Password</Link>
```

### Email Link Format
```
https://iauristi.online/confirm-password-reset?token={PLAINTEXT_TOKEN}
```

## Troubleshooting

### "Token not found in URL"
- Ensure email link is properly formatted
- Check that URL parameter is `token`, not `resetToken` or similar
- Verify link wasn't modified/truncated

### "Email not received"
- Check spam/junk folder
- Verify email address is correct
- Try requesting again (60 second cooldown)
- Check backend logs for email sending errors

### "Invalid or expired link"
- Token expires after 30 minutes
- Token can only be used once
- Request a new password reset

### "Too many requests"
- Wait a few moments and try again
- Or try a different email if allowed

### Different error than expected
- Check browser console for detailed error message
- Verify API endpoint is correct (`/auth/password-reset/request`)
- Check network tab to see actual response
- Review backend logs for errors

## Future Improvements

- [ ] Social login integration
- [ ] Magic link authentication (alternative to passwords)
- [ ] Passwordless email authentication
- [ ] Multi-factor authentication
- [ ] Password strength meter
- [ ] Additional security questions
- [ ] Account recovery codes
- [ ] Email verification on first password reset
