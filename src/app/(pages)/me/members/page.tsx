"use client";

import { OrgsSelect } from "@/src/components/shared/orgs-select";
import { Members } from "@/src/features/user-account/members/components/members";

export default function MembersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="max-w-xs">
        <OrgsSelect />
      </div>
      <Members />
    </div>
  );
}
