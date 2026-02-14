/**
 * INVITE SYSTEM - USAGE EXAMPLES
 * 
 * This file demonstrates how to integrate the invite system into your pages.
 */

// ============================================
// EXAMPLE 1: Invite Management Page
// ============================================
// File: src/app/(pages)/me/invites/page.tsx

import { InviteManagement } from "@/src/features/account";
import { useOrgId } from "@/src/hooks/use-org-id"; // or your organization context

export default function InvitesPage() {
  // Get orgId from your organization context, params, or store
  const orgId = "org-123"; // Replace with actual orgId from context
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage Invites</h1>
        <p className="text-muted-foreground">
          Send invites, create shareable links, and manage pending invitations
        </p>
      </div>
      
      <InviteManagement orgId={orgId} />
    </div>
  );
}

// ============================================
// EXAMPLE 2: Accept Invite Page (Public)
// ============================================
// File: src/app/invite/page.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { AcceptInviteCard } from "@/src/features/account";

export default function InvitePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <AcceptInviteCard token={token ?? undefined} />
    </div>
  );
}

// ============================================
// EXAMPLE 3: Custom Invite Component
// ============================================
// File: src/app/(pages)/me/organization/components/invite-section.tsx

"use client";

import { useListInvites, useCreateInvite } from "@/src/features/account";
import { Button } from "@/src/components/ui/button";
import { useState } from "react";

interface InviteSectionProps {
  orgId: string;
}

export function InviteSection({ orgId }: InviteSectionProps) {
  const [email, setEmail] = useState("");
  const { data: invites } = useListInvites(orgId);
  const createInvite = useCreateInvite(orgId);
  
  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    createInvite.mutate({ email });
    setEmail("");
  };
  
  return (
    <div className="space-y-4">
      <h2>Members</h2>
      
      <form onSubmit={handleSendInvite} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="member@example.com"
          required
        />
        <Button type="submit" disabled={createInvite.isPending}>
          Send Invite
        </Button>
      </form>
      
      <div>
        <p>Pending Invites: {invites?.filter(i => i.status === "pending").length || 0}</p>
      </div>
    </div>
  );
}

// ============================================
// EXAMPLE 4: Hook Usage Directly
// ============================================
// File: src/app/(pages)/me/components/invite-button.tsx

"use client";

import { useCreateInviteLink } from "@/src/features/account";
import { Button } from "@/src/components/ui/button";
import { Share2 } from "lucide-react";

interface InviteButtonProps {
  orgId: string;
  email: string;
}

export function InviteButton({ orgId, email }: InviteButtonProps) {
  const createLink = useCreateInviteLink(orgId);
  
  const handleClick = () => {
    createLink.mutate({
      email,
      role: "lawyer",
      expiresInDays: 7,
    });
  };
  
  return (
    <Button
      onClick={handleClick}
      disabled={createLink.isPending}
      variant="outline"
      size="sm"
    >
      <Share2 className="w-4 h-4 mr-2" />
      {createLink.isPending ? "Creating..." : "Share"}
    </Button>
  );
}

// ============================================
// EXAMPLE 5: Integration with Organization Settings
// ============================================
// File: src/app/(pages)/me/settings/organization/page.tsx

"use client";

import { useParams } from "next/navigation";
import {
  CreateInviteForm,
  InvitesList,
} from "@/src/features/account";
import { Card } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";

export default function OrganizationSettingsPage() {
  const params = useParams();
  const orgId = params.orgId as string;
  
  return (
    <div className="space-y-8">
      <div>
        <h1>Organization Settings</h1>
      </div>
      
      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invites">Invitations</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members" className="space-y-6">
          {/* Members list would go here */}
        </TabsContent>
        
        <TabsContent value="invites" className="space-y-6">
          <CreateInviteForm orgId={orgId} />
          <InvitesList orgId={orgId} />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          {/* Settings would go here */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================
// EXAMPLE 6: Header with Invite Link Generator
// ============================================
// File: src/components/header/invite-section.tsx

"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { InviteLinkGenerator } from "@/src/features/account";
import { UserPlus } from "lucide-react";
import { useState } from "react";

interface InviteSectionProps {
  orgId: string;
}

export function HeaderInviteSection({ orgId }: InviteSectionProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <div className="p-4">
          <InviteLinkGenerator orgId={orgId} />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================
// EXAMPLE 7: Type-Safe API Calls Outside Components
// ============================================
// File: src/lib/invite-utils.ts

import {
  createInvite,
  acceptInvite,
  type CreateInviteRequest,
} from "@/src/features/account";

export async function sendBulkInvites(
  orgId: string,
  emails: string[]
): Promise<void> {
  const results = await Promise.allSettled(
    emails.map((email) =>
      createInvite(orgId, {
        email,
        role: "lawyer",
        expiresInDays: 7,
      })
    )
  );
  
  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length > 0) {
    console.error(`${failed.length} invites failed to send`);
  }
}

export async function handleInviteToken(token: string): Promise<void> {
  try {
    const result = await acceptInvite(token);
    console.log(`Joined organization: ${result.org.name}`);
  } catch (error) {
    console.error("Failed to accept invite:", error);
  }
}

// ============================================
// EXAMPLE 8: Theming & Customization
// ============================================
// You can wrap components with providers for theme configuration

// File: src/features/account/components/ThemedInviteManagement.tsx

"use client";

import { InviteManagement } from "./InviteManagement";
import { useTheme } from "next-themes";

interface ThemedInviteManagementProps {
  orgId: string | null;
}

export function ThemedInviteManagement({
  orgId,
}: ThemedInviteManagementProps) {
  const { theme } = useTheme();
  
  return (
    <div data-theme={theme}>
      <InviteManagement orgId={orgId} />
    </div>
  );
}

// ============================================
// SETUP CHECKLIST
// ============================================
/*
1. ✅ Install dependencies:
   - TanStack React Query: npm install @tanstack/react-query
   - Sonner (toasts): npm install sonner
   - Date-fns: npm install date-fns
   - Lucide React: npm install lucide-react

2. ✅ Ensure Shadcn UI components are installed:
   - button, input, label, select, card
   - badge, table, skeleton, alert, tabs

3. ✅ Set up React Query Provider in your app layout

4. ✅ Configure environment variables:
   - NEXT_PUBLIC_API_URL (your API URL)

5. ✅ Import and use components as shown in examples above

6. ✅ Create pages for:
   - /me/invites (invite management)
   - /invite (accept invite page)
*/
