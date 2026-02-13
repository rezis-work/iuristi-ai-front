"use client";

import { CreateInviteForm } from "./CreateInviteForm";
import { InvitesList } from "./InvitesList";
import { InviteLinkGenerator } from "./InviteLinkGenerator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";

interface InviteManagementProps {
  orgId: string | null;
}

export function InviteManagement({ orgId }: InviteManagementProps) {
  return (
    <Tabs defaultValue="invites" className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12 items-center justify-center rounded-none bg-[#111111] text-zinc-400 gap-2">
        <TabsTrigger 
          value="invites"
          className="inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-zinc-400 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Active Invites
        </TabsTrigger>
        <TabsTrigger 
          value="send"
          className="inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-zinc-400 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Send Invite
        </TabsTrigger>
        <TabsTrigger 
          value="link"
          className="inline-flex items-center justify-center cursor-pointer whitespace-nowrap rounded-none px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-zinc-400 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-sm"
        >
          Generate Link
        </TabsTrigger>
      </TabsList>

      <TabsContent value="invites" className="mt-6">
        <InvitesList orgId={orgId} />
      </TabsContent>

      <TabsContent value="send" className="mt-6">
        <CreateInviteForm orgId={orgId} />
      </TabsContent>

      <TabsContent value="link" className="mt-6">
        <InviteLinkGenerator orgId={orgId} />
      </TabsContent>
    </Tabs>
  );
}
