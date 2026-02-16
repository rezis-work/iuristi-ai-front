"use client";

import { useLawyerProfile } from "../hook/lawyer.-profile";
import { LawyerProfileView } from "./view/lawyer-profile-view";
import { LawyerProfileEditForm } from "./lawyer-profile-edit-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Briefcase, AlertCircle } from "lucide-react";

export function LawyerProfile() {
  const {
    lawyerProfile,
    isLoading,
    isFetching,
    isError,
    error,
    orgId,
    isOrgsLoading,
  } = useLawyerProfile();

  return (
    <Card className="bg-transparent rounded-none md:rounded-sm border-none">
      <CardHeader className="px-0 pb-4">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-[#ff9D4D]" />
          Lawyer Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <LawyerProfileView
          profile={lawyerProfile}
          isLoading={isLoading}
          noOrgMessage={!isOrgsLoading && !orgId}
        />

        {isError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/20 p-4">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
            <p className="text-sm text-red-400">
              {error?.message || "Failed to load lawyer profile."}
            </p>
          </div>
        )}

        {!isOrgsLoading && !orgId && !isLoading && (
          <p className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4 text-sm text-neutral-400">
            Create an organization first to manage your lawyer profile.
          </p>
        )}
        {!isLoading && orgId && (
          <div className="pt-4 border-t border-neutral-800">
            <LawyerProfileEditForm
              profile={lawyerProfile}
              orgId={orgId}
              isRefetching={isFetching && !isLoading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
