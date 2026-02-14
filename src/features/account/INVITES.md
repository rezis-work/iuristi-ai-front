# Invite Management Feature

This document describes the frontend invite management system for Iauristi AI Front.

## Overview

The invite system allows users to:
- Create and send invites to other users via email
- Generate shareable invite links (QR-friendly)
- Accept invites to join organizations
- Preview invite details
- List and revoke pending invites

## Structure

```
src/features/account/
├── api/
│   └── invites.ts              # API functions
├── hooks/
│   └── use-invites.ts          # React Query hooks
├── schemas/
│   └── invites.schemas.ts      # Zod schemas
├── components/
│   ├── CreateInviteForm.tsx    # Form to send invites
│   ├── InvitesList.tsx         # Display list of invites
│   ├── InviteLinkGenerator.tsx # Generate shareable links
│   ├── AcceptInviteCard.tsx    # Accept invite UI
│   └── InviteManagement.tsx    # Tab-based management
└── index.ts                     # Barrel exports
```

## Components

### CreateInviteForm
Sends an invite to a specific email address.

```tsx
import { CreateInviteForm } from "@/src/features/account";

export function MyComponent() {
  const [orgId, setOrgId] = useState<string | null>("org-123");
  
  return <CreateInviteForm orgId={orgId} />;
}
```

**Props:**
- `orgId: string | null` - The organization ID

**Features:**
- Email input with validation
- Role selection (lawyer/admin)
- Expiration period selection
- Loading state and error handling

### InvitesList
Displays all invites for an organization with their status.

```tsx
import { InvitesList } from "@/src/features/account";

export function MyComponent() {
  return <InvitesList orgId="org-123" />;
}
```

**Props:**
- `orgId: string | null` - The organization ID

**Features:**
- Shows invite email, role, status, expiration
- Status badges (pending, accepted, revoked, expired)
- Revoke button for pending invites
- Sorted by creation date (newest first)

### InviteLinkGenerator
Creates shareable invite links that can be shared via QR code or direct link.

```tsx
import { InviteLinkGenerator } from "@/src/features/account";

export function MyComponent() {
  return <InviteLinkGenerator orgId="org-123" />;
}
```

**Props:**
- `orgId: string | null` - The organization ID

**Features:**
- Same form fields as CreateInviteForm
- Generates QR-friendly URL
- Copy-to-clipboard functionality
- Shows expiration date

### AcceptInviteCard
Displays invite details and allows users to accept invites.

```tsx
import { AcceptInviteCard } from "@/src/features/account";

export function MyComponent() {
  // Token from URL query params: ?token=xxx
  return <AcceptInviteCard token={tokenFromUrl} />;
}
```

**Props:**
- `token?: string` - The invite token (from URL or props)

**Features:**
- Shows organization details (name, logo)
- Displays invite role and expiration
- Confirmation before accepting
- Auto-redirects after accepting
- Shows invalid/expired message if needed

### InviteManagement
All-in-one component with tabbed interface for managing invites.

```tsx
import { InviteManagement } from "@/src/features/account";

export function SettingsPage() {
  return <InviteManagement orgId="org-123" />;
}
```

**Tabs:**
- **Active Invites** - View all invites with revoke option
- **Send Invite** - Direct email invites
- **Generate Link** - Create shareable links

## Hooks

### useListInvites
Query hook for fetching organization invites.

```tsx
const { data: invites, isLoading, error } = useListInvites(orgId);
```

### useCreateInvite
Mutation hook for creating/sending invites.

```tsx
const mutation = useCreateInvite(orgId);

mutation.mutate({
  email: "user@example.com",
  role: "lawyer",
  expiresInDays: 7,
});
```

### useAcceptInvite
Mutation hook for accepting invites.

```tsx
const mutation = useAcceptInvite();

mutation.mutate(inviteToken);
```

### useRevokeInvite
Mutation hook for revoking pending invites.

```tsx
const mutation = useRevokeInvite(orgId);

mutation.mutate(inviteId);
```

### useCreateInviteLink
Mutation hook for generating shareable invite links.

```tsx
const mutation = useCreateInviteLink(orgId);

mutation.mutate({
  email: "user@example.com",
  role: "lawyer",
  expiresInDays: 7,
});
```

### usePreviewInvite
Query hook for previewing invite details without authentication.

```tsx
const { data: preview, isLoading } = usePreviewInvite(token);

if (preview?.valid) {
  console.log(preview.org, preview.role, preview.expiresAt);
}
```

## API Functions

All API functions are in `src/features/account/api/invites.ts`:

- `createInvite(orgId, data)` - Send an invite
- `acceptInvite(token)` - Accept an invite
- `listInvites(orgId)` - Get organization invites
- `revokeInvite(orgId, inviteId)` - Revoke a pending invite
- `createInviteLink(orgId, data)` - Generate invite link
- `previewInvite(token)` - Preview invite details

## Types

All invite-related types are exported from:

```tsx
import type {
  InviteRole,
  CreateInviteRequest,
  CreateInviteResponse,
  AcceptInviteRequest,
  AcceptInviteResponse,
  InviteStatus,
  InviteListItem,
  InviteLinkResponse,
  InvitePreviewResponse,
} from "@/src/features/account";
```

## Integration Examples

### Complete Invite Management Page

```tsx
"use client";

import { useState } from "react";
import { InviteManagement } from "@/src/features/account";

export default function InviteSettingsPage() {
  const [orgId] = useState("org-123"); // Get from context/params
  
  return (
    <div className="container py-8">
      <h1>Manage Invites</h1>
      <InviteManagement orgId={orgId} />
    </div>
  );
}
```

### Accept Invite Page

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { AcceptInviteCard } from "@/src/features/account";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AcceptInviteCard token={token ?? undefined} />
    </div>
  );
}
```

## Styling

All components use Shadcn UI components:
- `Button`, `Input`, `Label`
- `Select`, `Card`, `Badge`
- `Table`, `Skeleton`, `Alert`
- `Tabs`

Ensure these components are installed in your project.

## Error Handling

All hooks use `sonner` for toast notifications:
- Success messages when operations complete
- Error messages when requests fail
- User-friendly error descriptions

## State Management

- Uses **TanStack React Query** for server state
- Automatic cache invalidation after mutations
- Stale time: 1 minute for invites list
- GC time: 5-10 minutes

## Security Notes

- Invite tokens are only returned once (in create response)
- Invite tokens are never logged
- Preview endpoint is public but returns minimal info only for valid tokens
- All mutations require authentication except preview
- Organization ID is validated server-side

## Browser Compatibility

- Requires modern browser (ES6+)
- Uses `Intl` API for date formatting
- Uses `navigator.clipboard` for copy-to-clipboard
- Requires Next.js 13+ (App Router)
