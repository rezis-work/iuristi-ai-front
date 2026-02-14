"use client";

import { MembersList } from "@/src/features/account/components/MembersList";
import { Suspense } from "react";
import { useMyOrgs } from "@/src/features/account/hooks/use-orgs";
import { Users } from "lucide-react";

export default function MembersPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 select-none">
          <p className="text-sm text-zinc-400">Loading members...</p>
        </div>
      }
    >
      <MembersPageContent />
    </Suspense>
  );
}

function MembersPageContent() {
  const { data: orgs, isLoading: isLoadingOrgs } = useMyOrgs();
  const orgId = orgs?.[0]?.id ?? null;

  return (
    <div className="space-y-6 select-none">
      <section className="w-full mb-2">
        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              Manage Members
            </h1>
            <p className="text-sm text-zinc-400 max-w-xl">
              View, update roles, and manage members of your organization. Only
              organization owners can perform these actions.
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
          <MembersList orgId={orgId} />
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
