"use client";

import { InviteManagement } from "@/src/features/account/components/InviteManagement";
import { Suspense } from "react";
import { useMyOrgs } from "@/src/features/account/hooks/use-orgs";

export default function InvitesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 select-none">
          <p className="text-sm text-zinc-400">Loading invites...</p>
        </div>
      }
    >
      <InvitesPageContent />
    </Suspense>
  );
}

function InvitesPageContent() {
  const { data: orgs, isLoading: isLoadingOrgs } = useMyOrgs();
  const orgId = orgs?.[0]?.id ?? null;

  return (
    <div className="space-y-6 select-none">
      <section className="w-full mb-2">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-white">
              Manage Invites
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl">
              Send invites, create shareable links, and manage pending
              invitations for your organization.
            </p>
          </div>

          {isLoadingOrgs ? (
            <div className="space-y-2" />
          ) : !orgs || orgs.length === 0 ? (
            <div className="text-sm text-zinc-500">
              You are not a member of any organizations yet.
            </div>
          ) : null}
        </div>
      </section>

      {orgId ? (
        <div className="space-y-4">
          <InviteManagement orgId={orgId} />
        </div>
      ) : !isLoadingOrgs && (!orgs || orgs.length === 0) ? null : !isLoadingOrgs ? (
        <p className="text-sm text-zinc-500">
          You are not a member of any organizations yet. Create one from the
          Organization page.
        </p>
      ) : null}
    </div>
  );
}
