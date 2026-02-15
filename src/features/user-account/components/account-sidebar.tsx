"use client";

import { useMemo, useRef, useState } from "react";
import {
  useGetMe,
  useUpdateProfile,
  useDeleteAvatar,
} from "@/src/features/user-account/profile/hooks/profile-api";
import { useLogOut } from "@/src/features/auth/hook/auth";
import { LogOut, ImagePlus, Loader2, Trash2 } from "lucide-react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { MONTHS_EN } from "@/src/features/user-account/constants/months";
import { uploadImage } from "@/src/components/upload/api/upload-image";
import { toast } from "sonner";

function formatEnglishDate(dateString?: string | null) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";

  const day = d.getDate();
  const monthName = MONTHS_EN[d.getMonth()] ?? "";
  const year = d.getFullYear();
  return `${day} ${monthName} ${year}`;
}

export function AccountSidebar() {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profile, isLoading } = useGetMe();
  const updateProfile = useUpdateProfile();
  const deleteAvatar = useDeleteAvatar();
  const { mutate: logout, isPending } = useLogOut();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileUrl = await uploadImage(file, "avatar");
      await updateProfile.mutateAsync({ avatarUrl: fileUrl });
      toast.success("Profile photo uploaded successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const initials =
    profile?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  const createdAtFormatted = useMemo(
    () => formatEnglishDate(profile?.createdAt),
    [profile],
  );

  if (isLoading) {
    return (
      <aside className="w-full rounded-sm bg-zinc-900 px-5 pt-8 pb-0 flex flex-col items-center">
        <div className="animate-pulse w-full">
          <div className="h-36 w-36 rounded-full bg-zinc-900 mx-auto mb-5 sm:h-40 sm:w-40" />
          <div className="h-6 w-32 bg-zinc-900 mx-auto mb-6 rounded" />
          <div className="space-y-3 mb-6">
            <div className="h-4 bg-zinc-900 rounded" />
            <div className="h-4 bg-zinc-900 rounded" />
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full rounded-sm bg-zinc-900 px-5 pt-8 pb-0 flex flex-col items-center">
      <div className="relative mb-5 h-36 w-36 rounded-full select-none border-[3px] border-[#ff9D4D] bg-[#2B2925] flex items-center justify-center overflow-visible sm:h-40 sm:w-40">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="sr-only"
          onChange={handleAvatarUpload}
        />
        <div className="h-full w-full overflow-hidden rounded-full">
          <Avatar className="h-full w-full border border-black/40 bg-black/40">
            <AvatarImage
              src={profile?.avatarUrl || undefined}
              alt={profile?.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-zinc-900 text-2xl sm:text-3xl font-semibold text-neutral-100">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full border-2 border-[#ff9D4D] bg-zinc-800 shadow-md transition-all hover:scale-110 hover:border-[#ff9D4D] hover:bg-zinc-700"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || updateProfile.isPending}
          title="ატვირთვა"
        >
          {isUploading || updateProfile.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
        </Button>
        {profile?.avatarUrl && (
          <Button
            variant="destructive"
            size="icon"
            className="absolute -right-1 -top-1 h-8 w-8 rounded-full shadow-md transition-all hover:scale-110"
            onClick={() => deleteAvatar.mutate()}
            disabled={deleteAvatar.isPending}
            title="წაშლა"
          >
            {deleteAvatar.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <h1 className="mb-6 text-center text-[20px] sm:text-[22px] font-semibold tracking-wide text-neutral-100">
        {profile?.name || profile?.email || "User"}
      </h1>
      <div className="mb-6 w-full py-3 flex flex-col gap-3 text-xs text-neutral-300">
        <div className="flex items-center justify-between gap-2">
          <span className="text-neutral-400">Registered at</span>
          <span className="font-medium text-neutral-200 text-right">
            {createdAtFormatted}
          </span>
        </div>
        {profile?.email && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-400">Email</span>
            <span className="font-medium text-neutral-200 text-right truncate max-w-[60%]">
              {profile.email}
            </span>
          </div>
        )}
        {profile?.phone && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-neutral-400">Phone</span>
            <span className="font-medium text-neutral-200 text-right">
              {profile.phone}
            </span>
          </div>
        )}
      </div>
      <div className="mt-auto w-full">
        <div className="w-[calc(100%+40px)] -mx-5 bg-[#151515] rounded-b-sm">
          <button
            onClick={() => logout()}
            disabled={isPending}
            className="inline-flex w-full items-center justify-center gap-2 px-4 py-4 text-[13px] sm:text-[14px] font-medium text-neutral-300 hover:bg-[#202020] rounded-b-sm hover:text-neutral-50 transition-colors duration-150 disabled:opacity-60 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
