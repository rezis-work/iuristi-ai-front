"use client";

import { LawyerProfile } from "@/src/features/user-account/lawyer-profile/components/lawyer-profile";
import { Suspense } from "react";

export default function LawyerProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-8 w-32 animate-pulse rounded bg-neutral-800" />
          <div className="h-48 animate-pulse rounded-lg bg-neutral-900/50" />
        </div>
      }
    >
      <div className="space-y-6">
        <section className="mb-2 w-full">
          <div className="space-y-4">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-white sm:text-2xl">
                Lawyer Profile
              </h1>
              <p className="max-w-xl text-sm text-zinc-400">
                Manage your practice areas and professional information.
              </p>
            </div>
          </div>
        </section>
        <LawyerProfile />
      </div>
    </Suspense>
  );
}
