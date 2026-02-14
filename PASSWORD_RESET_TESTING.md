# Password Reset - Quick Test Guide

## Before Testing
1. Ensure backend is running on `http://localhost:3001`
2. Ensure frontend is running on `http://localhost:3000`
3. Ensure email service (Resend) is configured (or mock in development)
4. Have access to test email account

## Test Scenario 1: Happy Path

### Expected Flow
```
1. User clicks "Forgot Password" link → /reset-password
2. Enters test@example.com
3. Clicks "Send Reset Link"
4. Sees "Check Your Email" confirmation screen
5. Clicks email link (contains token) from inbox
6. Auto-redirected to /confirm-password-reset?token=...
7. Form shows "Set New Password" form
8. Enters new password (e.g., NewPass123!)
9. Confirms password
10. Clicks "Reset Password"
11. Sees success message
12. Auto-redirected to /login
13. Can login with new password
```

### How to Execute
1. Start frontend: `npm run dev` (port 3000)
2. Start backend: See backend setup
3. Navigate to `http://localhost:3000/reset-password`
4. Enter your test email: `test@example.com`
5. Click "Send Reset Link"
6. Check email inbox for reset link
7. Click the link in the email
8. You should be redirected to `/confirm-password-reset?token=xxxxx`
9. Enter new password: `TestPassword123`
10. Confirm it: `TestPassword123`
11. Click "Reset Password"
12. You should see success toast and redirect to login

### Expected Results
- ✅ Email sent successfully (toast notification)
- ✅ Confirmation page shows email
- ✅ Token auto-populated in form (hidden)
- ✅ Password validation works
- ✅ Success message displays
- ✅ Redirected to login
- ✅ Can login with new password

---

## Test Scenario 2: Rate Limiting

### Expected Behavior
After 5 password reset requests in 24 hours, user should see:
> "Daily limit reached. Please try again tomorrow."

### How to Execute
1. Request password reset 5 times in succession
2. Click "Send Reset Link" button 5 times
3. On 6th attempt, should see rate limit error

### Expected Results
- ✅ First 5 requests succeed (with success toast)
- ✅ 6th request shows daily limit error
- ✅ Error message is specific and helpful

---

## Test Scenario 3: Cooldown Period

### Expected Behavior
Users must wait 60 seconds between password reset requests.

### How to Execute
1. Request password reset
2. Immediately try to request again
3. Should see error about cooldown

### Expected Results
- ✅ First request succeeds
- ✅ Second request shows cooldown error
- ✅ Error message mentions wait time

---

## Test Scenario 4: Invalid Token

### Expected Behavior
Using an invalid or expired token should show error.

### How to Execute
1. Manually navigate to:
   ```
   http://localhost:3000/confirm-password-reset?token=invalid123
   ```
2. Try to submit form
3. Should see error about invalid token

### Expected Results
- ✅ Forms shows "Set New Password" header
- ✅ Token field has "invalid123" value
- ✅ Submit shows error: "Invalid or expired reset link"
- ✅ Error suggests requesting new reset

---

## Test Scenario 5: Password Validation

### Expected Behavior
Password must be 8+ characters with at least one letter and one number.

### How to Execute
1. Complete password reset request flow
2. Go to confirm password form
3. Try these passwords in order:

   a) `short1` (too short)
      - Expected: "Password must be at least 8 characters"

   b) `nodoubtnumber` (no number)
      - Expected: "Password must contain at least one number"

   c) `12345678` (no letter)
      - Expected: "Password must contain at least one letter"

   d) `Valid123` ✓ (correct format)
      - Should work

4. If passwords match in both fields → Can submit

### Expected Results
- ✅ Short password rejected
- ✅ No-number password rejected
- ✅ No-letter password rejected
- ✅ Valid password accepted
- ✅ Mismatch error if confirm field differs

---

## Test Scenario 6: Password Mismatch

### Expected Behavior
Password and confirm password must match.

### How to Execute
1. Complete password reset request flow
2. Enter password: `Correct123`
3. Enter confirm: `Different456`
4. Attempt to submit

### Expected Results
- ✅ Error: "Passwords do not match"
- ✅ Confirm field is highlighted in red
- ✅ Form doesn't submit

---

## Test Scenario 7: Non-Existent Email

### Expected Behavior
For security, always show "email sent" even if email doesn't exist.

### How to Execute
1. Request reset for non-existent email: `noone@example.com`
2. Should still see success confirmation

### Expected Results
- ✅ System shows "Check Your Email" screen
- ✅ No indication whether email exists or not
- ✅ Prevents email enumeration attacks

---

## Test Scenario 8: Email Link Click (from real email)

### Expected Behavior
Clicking reset link from email auto-fills token and navigates correctly.

### How to Execute
1. Request password reset for real email: `yourname@example.com`
2. Check your actual email inbox
3. Click the "Reset Password" button/link
4. You should land on `/confirm-password-reset?token=...`

### Expected Results
- ✅ Email arrives within 1-2 seconds
- ✅ Link in email is clickable
- ✅ Landing page has token in URL
- ✅ Form shows token (hidden input)
- ✅ No manual token entry needed

---

## Common Issues & Solutions

### "Email not received"
- Check spam/junk folder
- Verify email address spelling
- Check backend logs: `EMAIL_SEND_FAILED`
- Ensure Resend API key is valid
- Try a different email address

### "Invalid token at URL"
- Email link might have been truncated
- Copy-paste link if manual entry needed
- Ensure token parameter name is `token`
- Check link formatting: `?token=xxxxx`

### "Can't login with new password"
- Verify you're entering the correct new password
- Check caps lock
- Try password reset again
- Check backend user table: password might not have been updated

### "Redirect to login not happening"
- Check browser console for errors
- Verify router is configured correctly
- Ensure `/login` route exists
- Check for blocking dialogs/modals

### "Toast notifications not showing"
- Verify `sonner` package is installed
- Check that `<Toaster />` is in root layout
- Check browser console for errors
- Ensure toast provider is wrapped correctly

---

## API Test with cURL

### Request Password Reset
```bash
curl -X POST http://localhost:3001/auth/password-reset/request \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected response:
```json
{
  "sent": true
}
```

### Confirm Password Reset
```bash
curl -X POST http://localhost:3001/auth/password-reset/confirm \
  -H "Content-Type: application/json" \
  -d '{
    "token":"actual_token_here",
    "newPassword":"NewPass123"
  }'
```

Expected response:
```json
{
  "reset": true
}
```

---

## Component Verification Checklist

- [ ] `ResetPasswordForm` component displays correctly
- [ ] Email input has proper validation feedback
- [ ] Form disables during submission
- [ ] Success confirmation screen shows email
- [ ] Back to Login button works
- [ ] Try Another Email resets form
- [ ] `ConfirmPasswordResetForm` loads with token from URL
- [ ] Password fields show placeholder text
- [ ] Password requirements list displays
- [ ] Both password fields match validation works
- [ ] Back to Login button works
- [ ] Reset Password button disables during submission
- [ ] Error messages appear in toast notifications
- [ ] Success message appears in toast notifications

---

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Form submission takes < 3 seconds (backend dependent)
- [ ] No console errors or warnings
- [ ] No memory leaks on form submission
- [ ] Images/icons load properly
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works

---

## Security Checks

- [ ] Password is never logged in console
- [ ] Token is not stored in localStorage
- [ ] Token is only in URL query parameter
- [ ] Token is in hidden input
- [ ] No sensitive data in CSS/DOM
- [ ] Email is masked in confirmation screen
- [ ] HTTPS secure flag set (production)
- [ ] CORS headers correct
- [ ] No password exposure in network tab

---

## Browser Testing

Test on:
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome (iOS/Android)
- [ ] Mobile Safari (iOS)
