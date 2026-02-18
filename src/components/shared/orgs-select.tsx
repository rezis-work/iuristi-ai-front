"use client";

import { useEffect, useMemo } from "react";
import { useGetOrgs } from "@/src/features/user-account/orgs/hooks/orgs";
import { useORgs } from "@/src/features/user-account/orgs/lib/org-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import Loading from "./Loading";
import { Building2, ChevronDown } from "lucide-react";

export function OrgsSelect() {
  const { data: orgs, isLoading } = useGetOrgs();
  const { orgs: selectedOrgId, setOrgs } = useORgs();

  const orgList = useMemo(() => orgs ?? [], [orgs]);
  useEffect(() => {
    if (orgList.length > 0 && (!selectedOrgId || selectedOrgId === "default")) {
      setOrgs(orgList[0].id);
    }
  }, [orgList, selectedOrgId, setOrgs]);
  const isValidSelection =
    selectedOrgId && selectedOrgId !== "default" && orgList.some((o) => o.id === selectedOrgId);
  const displayName = isValidSelection
    ? orgList.find((o) => o.id === selectedOrgId)?.name ?? "Select organization"
    : "Select organization";

  if (orgList.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-800/50 px-4 py-6 text-center">
        <p className="text-sm text-neutral-400">No organisation created</p>
        <Link
          href="/orgs/new"
          className="text-sm font-medium text-[#ff9D4D] hover:text-[#ffad6d] underline underline-offset-2"
        >
          Create a new organisation
        </Link>
      </div>
    );
  }

  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-zinc-800/80 border-neutral-700 text-neutral-200 hover:bg-zinc-700/80 h-10 font-normal cursor-pointer"
          >
            <span className="flex items-center gap-2 truncate">
              <Building2 className="size-4 shrink-0 opacity-70" />
              {displayName}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-[var(--radix-dropdown-menu-trigger-width)] bg-zinc-900 border-neutral-700 data-[state=open]:animate-none data-[state=closed]:animate-none"
        >
          <DropdownMenuRadioGroup
            value={isValidSelection ? selectedOrgId : orgList[0]?.id ?? ""}
            onValueChange={setOrgs}
          >
            {orgList.map((org) => (
              <DropdownMenuRadioItem
                key={org.id}
                value={org.id}
                className="text-neutral-200 focus:bg-neutral-800 cursor-pointer"
              >
                {org.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}