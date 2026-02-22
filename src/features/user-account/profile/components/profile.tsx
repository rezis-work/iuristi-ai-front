"use client";

import { parseAsBoolean, useQueryState } from "nuqs";
import { useGetMe } from "../hooks/profile-api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { Mail, Phone, User, Pencil, CheckCircle2, Briefcase } from "lucide-react";
import ProfileEditForm from "./profile-edit-form";

function getInitials(name: string | null, email: string) {
  if (name?.trim()) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  return email.slice(0, 2).toUpperCase();
}

export default function ProfileMe() {
  const [isEditing, setIsEditing] = useQueryState(
    "edit",
    parseAsBoolean.withDefault(false)
  );
  const { data: profileMe, isLoading } = useGetMe();

  if (isLoading)
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );

  if (!profileMe)
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-12 text-center">
        <User className="mx-auto h-12 w-12 text-neutral-600" />
        <p className="mt-3 text-sm text-neutral-500">Profile could not be loaded</p>
      </div>
    );

  if (isEditing) {
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm overflow-x-hidden">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-100">
            Edit Profile
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(null)}
            className="cursor-pointer rounded-lg text-neutral-400 transition-colors hover:bg-neutral-700/50 hover:text-neutral-100"
          >
            Cancel
          </Button>
        </div>
        <ProfileEditForm onSuccess={() => setIsEditing(null)} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar className="h-16 w-16 shrink-0 border-2 border-neutral-600">
          <AvatarImage src={profileMe.avatarUrl ?? undefined} alt={profileMe.name ?? "Profile"} />
          <AvatarFallback className="bg-[#ff9D4D]/10 text-lg font-medium text-[#ff9D4D]">
            {getInitials(profileMe.name, profileMe.email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-neutral-100">
              {profileMe.name || "Anonymous User"}
            </h2>
            <p className="text-sm text-neutral-400">{profileMe.email}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="cursor-pointer rounded-lg border-neutral-600 bg-neutral-800/30 px-4 py-2 text-neutral-200 shadow-sm transition-all hover:border-[#ff9D4D]/50 hover:bg-neutral-700/50 hover:text-[#ff9D4D]"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-3 border-t border-neutral-700 pt-6">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-700/50">
            <Mail className="h-4 w-4 text-[#ff9D4D]" />
          </div>
          <div>
            <p className="text-neutral-500">Email</p>
            <p className="text-neutral-200 flex items-center gap-2">
              {profileMe.email}
              {profileMe.emailVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  verified
                </span>
              )}
            </p>
          </div>
        </div>
        {profileMe.phone && (
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-700/50">
              <Phone className="h-4 w-4 text-[#ff9D4D]" />
            </div>
            <div>
              <p className="text-neutral-500">Phone</p>
              <p className="text-neutral-200">{profileMe.phone}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-700/50">
            <Briefcase className="h-4 w-4 text-[#ff9D4D]" />
          </div>
          <div>
            <p className="text-neutral-500">Account Type</p>
            <p className="text-neutral-200">
              {(!profileMe.accountType || profileMe.accountType === "person")
                ? "Person"
                : profileMe.accountType === "lawyer"
                  ? "Lawyer"
                  : "Business Owner"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
