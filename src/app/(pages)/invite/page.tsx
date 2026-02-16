"use client";

import Wrapper from "@/src/components/shared/wrapper";
import { AcceptInviteCard } from "@/src/features/user-account/invites/components/accept-invite-card";

export default function InvitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0d0d0d] via-[#111111] to-[#0a0a0a] py-12 px-4">
      <Wrapper className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-neutral-50">
            Organization Invite
          </h1>
          <p className="mt-2 text-neutral-400">
            Click the button below to join the organization
          </p>
        </div>
        <AcceptInviteCard />
      </Wrapper>
    </div>
  );
}
