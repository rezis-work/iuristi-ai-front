# Quick Reference Guide - Invite System

## 📁 File Structure

```
src/features/account/
├── api/
│   └── invites.ts .......................... 178 lines | API client functions
├── hooks/
│   └── use-invites.ts ...................... 110 lines | React Query hooks
├── schemas/
│   └── invites.schemas.ts ................. 21 lines | Zod validation
├── components/
│   ├── CreateInviteForm.tsx ............... 88 lines | Send email invites
│   ├── InvitesList.tsx .................... 105 lines | List all invites
│   ├── InviteLinkGenerator.tsx ............ 112 lines | Create shareable links
│   ├── AcceptInviteCard.tsx ............... 120 lines | Accept invite UI
│   └── InviteManagement.tsx ............... 33 lines | Tabbed interface
├── index.ts .............................. Barrel exports
├── INVITES.md ............................. Full documentation
└── USAGE_EXAMPLES.md ...................... 8 code examples
```

## 🚀 Quick Import Guide

### Import Everything
```tsx
import {
  CreateInviteForm,
  InvitesList,
  InviteLinkGenerator,
  AcceptInviteCard,
  InviteManagement,
  useListInvites,
  useCreateInvite,
  useAcceptInvite,
  useRevokeInvite,
  useCreateInviteLink,
  usePreviewInvite,
  createInvite,
  acceptInvite,
  listInvites,
  revokeInvite,
  createInviteLink,
  previewInvite,
} from "@/src/features/account";
```

### Import Individual Components
```tsx
import { CreateInviteForm } from "@/src/features/account";
import { InviteManagement } from "@/src/features/account";
import { AcceptInviteCard } from "@/src/features/account";
```

### Import Just Hooks
```tsx
import { useCreateInvite, useListInvites } from "@/src/features/account";
```

### Import Just API
```tsx
import { createInvite, acceptInvite } from "@/src/features/account";
```

## 💻 Component Cheat Sheet

### InviteManagement (Recommended - All-in-One)
```tsx
<InviteManagement orgId="org-123" />
```
✅ Tabs for: Invites | Send | Link Generator
✅ Complete feature set
✅ Best for org settings page

### CreateInviteForm (Send Email)
```tsx
<CreateInviteForm orgId="org-123" />
```
✅ Email input
✅ Role selector
✅ Expiration dropdown
✅ Send button

### InvitesList (View/Revoke)
```tsx
<InvitesList orgId="org-123" />
```
✅ Table display
✅ Status badges
✅ Revoke action
✅ Empty state

### InviteLinkGenerator (Share Link)
```tsx
<InviteLinkGenerator orgId="org-123" />
```
✅ QR-friendly URL
✅ Copy-to-clipboard
✅ Expiration date
✅ Email input

### AcceptInviteCard (Accept Invite)
```tsx
<AcceptInviteCard token={tokenFromUrl} />
```
✅ Org preview
✅ Role display
✅ Confirm action
✅ Auto redirect

## 🪝 Hook Cheat Sheet

### useListInvites - Fetch invites
```tsx
const { data, isLoading, error } = useListInvites(orgId);
```

### useCreateInvite - Send invite
```tsx
const mutation = useCreateInvite(orgId);
mutation.mutate({ email, role, expiresInDays });
```

### useAcceptInvite - Accept invite
```tsx
const mutation = useAcceptInvite();
mutation.mutate(token);
```

### useRevokeInvite - Revoke invite
```tsx
const mutation = useRevokeInvite(orgId);
mutation.mutate(inviteId);
```

### useCreateInviteLink - Generate link
```tsx
const mutation = useCreateInviteLink(orgId);
mutation.mutate({ email, role, expiresInDays });
// mutation.data?.inviteUrl contains the URL
```

### usePreviewInvite - Preview without auth
```tsx
const { data, isLoading } = usePreviewInvite(token);
// data.org, data.role, data.expiresAt
```

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  SEND INVITE FLOW                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. CreateInviteForm collects data                      │
│            ↓                                             │
│  2. useCreateInvite mutation called                     │
│            ↓                                             │
│  3. createInvite() API call made                        │
│            ↓                                             │
│  4. Backend creates invite                             │
│            ↓                                             │
│  5. Response with token returned                       │
│            ↓                                             │
│  6. Cache invalidated (invites list)                   │
│            ↓                                             │
│  7. Toast notification shown                           │
│            ↓                                             │
│  Form reset, list updates                              │
│                                                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  ACCEPT INVITE FLOW                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. User visits /invite?token=xxx                       │
│            ↓                                             │
│  2. AcceptInviteCard mounts                            │
│            ↓                                             │
│  3. usePreviewInvite fetches details                   │
│            ↓                                             │
│  4. User sees org info, clicks accept                  │
│            ↓                                             │
│  5. useAcceptInvite mutation called                    │
│            ↓                                             │
│  6. acceptInvite() API call made                       │
│            ↓                                             │
│  7. Backend creates membership                         │
│            ↓                                             │
│  8. Response returned                                  │
│            ↓                                             │
│  9. Toast success shown                               │
│            ↓                                             │
│  10. Auto redirect to /me                             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 📊 Type Reference

### InviteRole
```tsx
type InviteRole = "lawyer" | "admin"
```

### InviteStatus
```tsx
type InviteStatus = "pending" | "accepted" | "revoked" | "expired"
```

### CreateInviteRequest
```tsx
{
  email: string
  role?: InviteRole
  expiresInDays?: number
}
```

### InviteListItem
```tsx
{
  id: string
  email: string
  role: string
  expiresAt: string
  acceptedAt: string | null
  revokedAt: string | null
  createdAt: string
  status: InviteStatus
}
```

### InvitePreviewResponse
```tsx
{
  valid: boolean
  org?: { id, name, logoUrl }
  role?: string
  expiresAt?: string
}
```

## 🎯 Common Use Cases

### Setup Organization Invite Page
```tsx
export default function OrganizationPage() {
  return <InviteManagement orgId="org-123" />;
}
```

### Setup Invite Accept Page
```tsx
export default function InvitePage() {
  const searchParams = useSearchParams();
  return <AcceptInviteCard token={searchParams.get("token")} />;
}
```

### Programmatic Invite Creation
```tsx
const result = await createInvite("org-123", {
  email: "user@example.com",
  role: "lawyer",
});
console.log(result.inviteToken); // Only appears once!
```

### Bulk Operations
```tsx
const emails = ["a@x.com", "b@x.com", "c@x.com"];
await Promise.all(
  emails.map(e => 
    createInvite("org", { email: e, role: "lawyer" })
  )
);
```

### Custom UI
```tsx
const mutation = useCreateInvite("org-123");

return (
  <form onSubmit={(e) => {
    e.preventDefault();
    mutation.mutate({
      email: input.value,
      role: "lawyer",
    });
  }}>
    <input value={input} onChange={e => setInput(e.target.value)} />
    <button disabled={mutation.isPending}>Invite</button>
  </form>
);
```

## 🔒 Security Checklist

- ✅ Never log invite tokens
- ✅ Server validates orgId
- ✅ Auth required for mutations
- ✅ Public preview is safe
- ✅ Token never sent in response after create
- ✅ Client validates email format
- ✅ Server validates all inputs

## 🐛 Debugging Tips

### Enable TanStack Query DevTools
```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function RootLayout() {
  return (
    <>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Log Query State
```tsx
const { data, isLoading, error, status } = useListInvites(orgId);
console.log({ data, isLoading, error, status });
```

### Check Toast Notifications
- Look at browser console for errors
- Sonner toast appears bottom-right
- Success/error messages auto-dismiss

### Verify Token Extraction
```tsx
const searchParams = useSearchParams();
const token = searchParams.get("token");
console.log("Token from URL:", token);
```

## 📝 Requirements

### Runtime
- Node.js 18+
- Next.js 13+
- React 18+

### Dependencies
```json
{
  "@tanstack/react-query": "^5.0.0",
  "sonner": "^1.0.0",
  "date-fns": "^2.30.0",
  "lucide-react": "^0.263.0",
  "zod": "^3.22.0"
}
```

### Shadcn UI Components
```
button input label select card
badge table skeleton alert tabs
```

## 🎨 Customization

### Change Colors
Modify Tailwind classes in components:
```tsx
// From:
<Badge className={getStatusColor(invite.status)}>

// To:
<Badge className="bg-custom text-custom">
```

### Change Messages
Edit toast messages in hooks:
```tsx
toast.success(`Customized: Invite sent to ${data.email}`);
```

### Add More Roles
Update types and server validation:
```tsx
type InviteRole = "lawyer" | "admin" | "accountant";
```

### Change Expiration Options
Modify Select options in components:
```tsx
<SelectItem value="60">60 Days</SelectItem>
```

## 🌐 Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Or uses defaults:
- Production: `/api`
- Development: `http://localhost:3001`

## 📚 Reference Links

- **API Docs**: `src/features/account/INVITES.md`
- **Examples**: `src/features/account/USAGE_EXAMPLES.md`
- **Setup**: `IMPLEMENTATION_CHECKLIST.md`
- **This Guide**: `QUICK_REFERENCE.md`

---

**Created**: February 12, 2026
**Status**: ✅ Ready for Production
**Support**: Check documentation or console logs for errors
