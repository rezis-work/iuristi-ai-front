"use client";

import { useSearchParams } from "next/navigation";
import { MembersList } from "@/src/features/account/components/MembersList";
import { Suspense, useState, useEffect } from "react";
import { useMyOrgs } from "@/src/features/account/hooks/use-orgs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { ORG_ID_UUID_REGEX } from "@/src/lib/org";
import { Building2, ChevronDown, Users } from "lucide-react";
import SheardButton from "@/src/components/shared/SheardButton";

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
  const searchParams = useSearchParams();
  const rawParamOrgId = searchParams.get("orgId");

  // მხოლოდ მაშინ ვაყენებთ initial orgId-ს, თუ URL-დან მოსული მნიშვნელობა სწორი UUID-ია
  const initialOrgId =
    rawParamOrgId && ORG_ID_UUID_REGEX.test(rawParamOrgId)
      ? rawParamOrgId
      : null;

  const [orgId, setOrgId] = useState<string | null>(initialOrgId);
  const { data: orgs, isLoading: isLoadingOrgs } = useMyOrgs();

  // Set initial orgId from URL if it exists in user's orgs
  useEffect(() => {
    if (initialOrgId && orgs && !orgId) {
      const orgExists = orgs.some((org) => org.id === initialOrgId);
      if (orgExists) {
        setOrgId(initialOrgId);
      }
    }
  }, [initialOrgId, orgs, orgId]);

  const handleOrgChange = (value: string) => {
    setOrgId(value);
  };

  const handleResetOrg = () => {
    setOrgId(null);
  };

  const selectedOrg = orgs?.find((org) => org.id === orgId) || null;

  return (
    <div className="space-y-6 select-none">
      {/* Header-style dark bar */}
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
          ) : (
            <div className="flex flex-col w-full sm:flex-row mb-8 sm:items-end gap-2 justify-between">
              <div className="w-full sm:w-auto sm:min-w-65 sm:max-w-xs">
                <label className="text-xs uppercase tracking-wide text-white font-semibold block mb-2">
                  Select Organization
                </label>

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center justify-between w-full h-10 px-5 rounded-none bg-[#ff9D4D] text-white cursor-pointer text-sm outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Building2 className="w-4 h-4 text-white shrink-0" />
                        {selectedOrg ? (
                          <span className="truncate">{selectedOrg.name}</span>
                        ) : (
                          <span className="text-white">
                            Choose an organization...
                          </span>
                        )}
                      </span>
                      <ChevronDown className="w-4 h-4 text-white shrink-0" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) bg-zinc-950 rounded-none"
                    align="start"
                  >
                    {orgs.map((org) => (
                      <DropdownMenuItem
                        key={org.id}
                        className="cursor-pointer rounded-none focus:bg-black"
                        onSelect={(e) => {
                          e.preventDefault();
                          handleOrgChange(org.id);
                        }}
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-white">
                            {org.name}
                          </span>
                          <span className="text-xs text-white capitalize">
                            {org.type.replace("_", " ")} • {org.role}
                          </span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {orgId && (
                <SheardButton onClick={handleResetOrg} className="py-5 px-5">
                  Clear Selection
                </SheardButton>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Content area */}
      {orgId ? (
        <div className="space-y-4">
          <MembersList orgId={orgId} />
        </div>
      ) : (
        <p className="text-sm text-zinc-500">
          Select an organization above to start managing members.
        </p>
      )}
    </div>
  );
}
