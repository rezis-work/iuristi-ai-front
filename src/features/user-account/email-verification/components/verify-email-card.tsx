"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVerifyEmail } from "../hook/verification";
import { useGetMe } from "@/src/features/user-account/profile/hooks/profile-api";
import { Button } from "@/src/components/ui/button";
import { Mail, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

export function VerifyEmailCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const { data: profile, isLoading: isLoadingProfile } = useGetMe();
  const { mutate: verifyEmail, isPending, isSuccess, isError } = useVerifyEmail();
  const hasAttempted = useRef(false);

  useEffect(() => {
    if (!token || isLoadingProfile || !profile || hasAttempted.current) return;
    hasAttempted.current = true;
    verifyEmail({ token });
  }, [token, isLoadingProfile, profile, verifyEmail]);

  if (!token) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-6">
            <Mail className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-100 mb-2">
            Invalid verification link
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            The verification link is missing or invalid. Please request a new
            verification email from your account settings.
          </p>
          <Button asChild className="bg-[#ff9D4D] hover:bg-[#ff8D3D]">
            <Link href="/me/settings">Go to Settings</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!profile && !isLoadingProfile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-6">
            <Mail className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-100 mb-2">
            Log in to verify
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            Please log in to your account to verify your email address.
          </p>
          <Button asChild className="bg-[#ff9D4D] hover:bg-[#ff8D3D]">
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isPending || isLoadingProfile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#ff9D4D] mb-6" />
          <h1 className="text-xl font-semibold text-neutral-100">
            Verifying your email...
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-100 mb-2">
            Email verified successfully
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            Your email has been verified. You can now use all features of your
            account.
          </p>
          <Button
            onClick={() => router.push("/me/profile")}
            className="bg-[#ff9D4D] hover:bg-[#ff8D3D]"
          >
            Go to Profile
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-6">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-xl font-semibold text-neutral-100 mb-2">
            Verification failed
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            The verification link may have expired or is invalid. Please request
            a new verification email from your account settings.
          </p>
          <Button asChild className="bg-[#ff9D4D] hover:bg-[#ff8D3D]">
            <Link href="/me/settings">Go to Settings</Link>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
