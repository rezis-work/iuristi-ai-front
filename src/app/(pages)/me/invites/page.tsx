"use client";

import { OrgsSelect } from "@/src/components/shared/orgs-select";
import { Invites } from "@/src/features/user-account/invites/components/invites";

export default function InvitesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-xs">
        <OrgsSelect />
      </div>
      <Invites />
    </div>
  );
}

