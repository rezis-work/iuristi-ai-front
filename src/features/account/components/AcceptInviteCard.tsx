"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useAcceptInvite, usePreviewInvite } from "../hooks/use-invites";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Alert, AlertDescription } from "@/src/components/ui/alert";
import { AlertCircle, CheckCircle, Building2 } from "lucide-react";
import Image from "next/image";

interface AcceptInviteCardProps {
  token?: string;
}

export function AcceptInviteCard({ token: initialToken }: AcceptInviteCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = initialToken ?? searchParams.get("token");

  const { data: preview, isLoading: isLoadingPreview } = usePreviewInvite(token);
  const acceptInviteMutation = useAcceptInvite();

  const handleAccept = async () => {
    if (!token) return;
    try {
      await acceptInviteMutation.mutateAsync(token);
      // Redirect to organization or dashboard
      setTimeout(() => {
        router.push("/me");
      }, 2000);
    } catch (error) {
      console.error("Failed to accept invite", error);
    }
  };

  if (isLoadingPreview) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Loading Invite...</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!preview?.valid) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Invalid Invite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              This invite is invalid, expired, or has already been used.
            </AlertDescription>
          </Alert>
          <Button
            className="w-full mt-4"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          You&apos;re Invited!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {preview.org && (
          <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="shrink-0">
              {preview.org.logoUrl ? (
                <Image
                  src={preview.org.logoUrl}
                  alt={preview.org.name}
                  className="h-12 w-12 rounded object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded bg-ლინეარ-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white">
                  <Building2 className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="grow">
              <p className="font-semibold text-sm">{preview.org.name}</p>
              {preview.role && (
                <p className="text-xs text-muted-foreground mt-1">
                  Role: <span className="capitalize font-medium">{preview.role}</span>
                </p>
              )}
              {preview.expiresAt && (
                <p className="text-xs text-muted-foreground mt-1">
                  Expires: {new Date(preview.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You are about to join this organization. Make sure you want to proceed.
          </AlertDescription>
        </Alert>

        <div className="space-y-2 pt-2">
          <Button
            className="w-full"
            onClick={handleAccept}
            disabled={acceptInviteMutation.isPending}
          >
            {acceptInviteMutation.isPending ? "Accepting..." : "Accept Invite"}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.back()}
            disabled={acceptInviteMutation.isPending}
          >
            Cancel
          </Button>
        </div>

        {acceptInviteMutation.isSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully accepted! Redirecting...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
