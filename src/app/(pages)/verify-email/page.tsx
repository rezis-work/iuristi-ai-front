"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { VerifyEmailCard } from "@/src/features/user-account/email-verification/components/verify-email-card";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff9D4D]" />
        </div>
      }
    >
      <VerifyEmailCard />
    </Suspense>
  );
}
