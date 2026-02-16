"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetInvitePreview, useAcceptInvite } from "../hooks/invite";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const { data: preview, isLoading: isPreviewLoading } = useGetInvitePreview(token);
  const acceptInvite = useAcceptInvite();

  const isValid = preview?.valid ?? false;
  const org = preview?.org;
  const role = preview?.role;

  useEffect(() => {
    if (acceptInvite.isSuccess) {
      router.push("/me/organization");
    }
  }, [acceptInvite.isSuccess, router]);

  function handleAccept() {
    if (!token) return;
    acceptInvite.mutate({ token });
  }

  if (!token?.trim()) {
    return (
      <Card className="max-w-md mx-auto bg-zinc-900/90 border-neutral-700/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-neutral-100 flex items-center gap-2">
            <XCircle className="size-5 text-red-400" />
            Invalid link
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Invite link not found or not specified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="outline" className="border-neutral-600 cursor-pointer">
              Log in
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (isPreviewLoading) {
    return (
      <Card className="max-w-md mx-auto bg-zinc-900/90 border-neutral-700/80 shadow-xl">
        <CardContent className="py-12 flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-[#ff9D4D]" />
          <p className="text-neutral-400">Checking invite...</p>
        </CardContent>
      </Card>
    );
  }

  if (!isValid) {
    return (
      <Card className="max-w-md mx-auto bg-zinc-900/90 border-neutral-700/80 shadow-xl">
        <CardHeader>
          <CardTitle className="text-neutral-100 flex items-center gap-2">
            <XCircle className="size-5 text-red-400" />
            Invalid invite
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Link has expired, been revoked, or is invalid.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login">
            <Button variant="outline" className="border-neutral-600 cursor-pointer">
              Log in
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto bg-zinc-900/90 border-neutral-700/80 shadow-xl">
      <CardHeader>
        <CardTitle className="text-neutral-100 flex items-center gap-2">
          <CheckCircle className="size-5 text-emerald-400" />
          Invite to organization
        </CardTitle>
        <CardDescription className="text-neutral-400">
          You are invited to &quot;{org?.name ?? "—"}&quot; with role &quot;
          {role === "lawyer" ? "Lawyer" : role === "admin" ? "Admin" : role ?? "—"}&quot;
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleAccept}
          disabled={acceptInvite.isPending}
          className="w-full bg-[#ff9D4D] hover:bg-[#ffa95d] text-white shadow-lg shadow-[#ff9D4D]/25 transition-all cursor-pointer"
        >
          {acceptInvite.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Accepting...
            </>
          ) : (
            "Accept Invite"
          )}
        </Button>
        <Link href="/me/organization" className="block">
          <Button variant="ghost" className="w-full text-neutral-400 cursor-pointer">
            Cancel
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function AcceptInviteCard() {
  return (
    <Suspense
      fallback={
        <Card className="max-w-md mx-auto bg-zinc-900/90 border-neutral-700/80 shadow-xl">
          <CardContent className="py-12 flex flex-col items-center gap-4">
            <Loader2 className="size-10 animate-spin text-[#ff9D4D]" />
            <p className="text-neutral-400">Loading...</p>
          </CardContent>
        </Card>
      }
    >
      <AcceptInviteContent />
    </Suspense>
  );
}
