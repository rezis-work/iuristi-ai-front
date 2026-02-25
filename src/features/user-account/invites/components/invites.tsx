"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useGetOrgs } from "@/src/features/user-account/orgs/hooks/orgs";
import { useORgs } from "@/src/features/user-account/orgs/lib/org-state";
import { useGetInviteList } from "../hooks/invite";
import { InvitesList } from "./invites-list";
import { CreateInviteForm } from "./create-invite-form";
import { Mail, List, Loader2 } from "lucide-react";

function InvitesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-14 w-full bg-zinc-800" />
      ))}
    </div>
  );
}

export function Invites() {
  const { data: orgs, isLoading: isOrgsLoading } = useGetOrgs();
  const { orgs: selectedOrgId } = useORgs();
  const orgList = orgs ?? [];
  const isValidSelected =
    selectedOrgId && selectedOrgId !== "default" && orgList.some((o) => o.id === selectedOrgId);
  const orgId = isValidSelected ? selectedOrgId : orgList[0]?.id ?? null;
  const { data: invites = [], isLoading: isInvitesLoading } = useGetInviteList(
    orgId ?? ""
  );

  const isLoading = isOrgsLoading || (!!orgId && isInvitesLoading);
  const canManage = true;

  if (isOrgsLoading || !orgId) {
    return (
      <Card className="bg-transparent rounded-none md:rounded-sm border-none">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
            <Mail className="h-6 w-6 text-[#ff9D4D]" />
            მოწვევები
          </CardTitle>
          <CardDescription className="text-neutral-400">
            {!orgId && !isOrgsLoading
              ? "ორგანიზაცია არ არის არჩეული ან ვერ მოიძებნა."
              : "მოწვევები იტვირთება..."}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          {isOrgsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
            </div>
          ) : (
            <InvitesSkeleton />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-transparent rounded-none md:rounded-sm border-none">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
            <Mail className="h-6 w-6 text-[#ff9D4D]" />
            მოწვევები
        </CardTitle>
        <CardDescription className="text-neutral-400">
          მართე მოწვევები და შექმენი ახალი მოწვევები
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="bg-zinc-800/80 border border-neutral-700/80 mb-6 gap-1 p-1">
            <TabsTrigger
              value="list"
              className="text-white hover:text-yellow-400 transition-colors data-[state=active]:bg-[#ff9D4D]/20 data-[state=active]:text-[#ff9D4D] data-[state=active]:border-[#ff9D4D]/40 data-[state=active]:hover:text-[#ff9D4D] cursor-pointer"
            >
              <List className="mr-2 size-4" />
              მოწვევების სია
            </TabsTrigger>
            <TabsTrigger
              value="invite"
              className="text-white hover:text-yellow-400 transition-colors data-[state=active]:bg-[#ff9D4D]/20 data-[state=active]:text-[#ff9D4D] data-[state=active]:border-[#ff9D4D]/40 data-[state=active]:hover:text-[#ff9D4D] cursor-pointer"
            >
              <Mail className="mr-2 size-4" />
              ახალი მოწვევა
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
              </div>
            ) : invites.length === 0 ? (
              <div className="rounded-lg border border-neutral-700/60 bg-zinc-900/40 p-8 text-center">
                <p className="text-neutral-300">მოლოდინში მოწვევა ჯერ არ არის</p>
                <p className="text-sm text-neutral-500 mt-1">
                  შექმენი ახალი მოწვევა ზემოთ არსებული ტაბიდან
                </p>
              </div>
            ) : (
              <InvitesList invites={invites} orgId={orgId} canManage={canManage} />
            )}
          </TabsContent>

          <TabsContent value="invite" className="mt-0">
            <div className="max-w-md">
              <CreateInviteForm orgId={orgId} />
              <p className="text-sm text-neutral-500 mt-4">
                მოწვევა შეიქმნება მითითებული ელფოსტისთვის. დააკოპირე გენერირებული ბმული და გაუზიარე ადრესატს — სისტემა ელფოსტას ავტომატურად არ აგზავნის.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
