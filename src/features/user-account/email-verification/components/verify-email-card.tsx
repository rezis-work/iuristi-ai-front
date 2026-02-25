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
            დადასტურების ბმული არასწორია
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            დადასტურების ბმული აკლია ან არასწორია. გთხოვ, ანგარიშის პარამეტრებიდან
            მოითხოვე ახალი დადასტურების ელფოსტა.
          </p>
          <Button asChild className="bg-[#ff9D4D] hover:bg-[#ff8D3D]">
            <Link href="/me/settings">პარამეტრებზე გადასვლა</Link>
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
            შესვლა დადასტურებისთვის
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            ელფოსტის დასადასტურებლად გთხოვ, შეხვიდე შენს ანგარიშში.
          </p>
          <Button asChild className="bg-[#ff9D4D] hover:bg-[#ff8D3D]">
            <Link href="/login">შესვლა</Link>
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
            ელფოსტა მოწმდება...
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            გთხოვ, მოიცადე.
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
            ელფოსტა წარმატებით დადასტურდა
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            შენი ელფოსტა დადასტურებულია. ახლა შეგიძლია ანგარიშის ყველა ფუნქციის გამოყენება.
          </p>
          <Button
            onClick={() => router.push("/me/profile")}
            className="bg-[#ff9D4D] hover:bg-[#ff8D3D]"
          >
            პროფილზე გადასვლა
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
            დადასტურება ვერ მოხერხდა
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            დადასტურების ბმული შესაძლოა ვადაგასული ან არასწორია. გთხოვ, ანგარიშის
            პარამეტრებიდან მოითხოვე ახალი დადასტურების ელფოსტა.
          </p>
          <Button asChild className="bg-[#ff9D4D] hover:bg-[#ff8D3D]">
            <Link href="/me/settings">პარამეტრებზე გადასვლა</Link>
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
