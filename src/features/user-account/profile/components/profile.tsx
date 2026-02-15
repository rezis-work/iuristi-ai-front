"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useGetMe, useDeleteAvatar, useUpdateProfile } from "../hooks/profile-api";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/src/components/ui/form";
import { Mail, Phone, User, Loader2, Pencil, Trash2, ImagePlus } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { uploadImage } from "@/src/components/upload/api/upload-image";
import { toast } from "sonner";
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
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { data: profileMe, isLoading } = useGetMe();
  const deleteAvatar = useDeleteAvatar();
  const updateProfile = useUpdateProfile();

  const avatarForm = useForm<{ avatar: FileList | null }>({
    defaultValues: { avatar: null },
  });

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const fileUrl = await uploadImage(file, "avatar");
      await updateProfile.mutateAsync({ avatarUrl: fileUrl });
      toast.success("პროფილის სურათი წარმატებით აიტვირთა");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა");
    } finally {
      setIsUploading(false);
      avatarForm.setValue("avatar", null);
      e.target.value = "";
    }
  }

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
      <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-neutral-100">
            Edit Profile
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(false)}
            className="rounded-lg text-neutral-400 transition-colors hover:bg-neutral-700/50 hover:text-neutral-100"
          >
            Cancel
          </Button>
        </div>
        <ProfileEditForm onSuccess={() => setIsEditing(false)} />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative group">
          <Form {...avatarForm}>
            <FormField
              control={avatarForm.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={(e) => {
                        handleAvatarUpload(e);
                        field.onChange(e.target.files);
                      }}
                    />
                  </FormControl>
                  <FormLabel
                    className={cn(
                      "absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-neutral-600 bg-neutral-800 shadow-md transition-all hover:scale-110 hover:border-[#ff9D4D]/50 hover:bg-neutral-700",
                      (isUploading || updateProfile.isPending) && "pointer-events-none"
                    )}
                    title="ატვირთვა"
                  >
                    {isUploading || updateProfile.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                  </FormLabel>
                </FormItem>
              )}
            />
          </Form>
          <Avatar className="h-16 w-16 border-2 border-neutral-600">
            <AvatarImage src={profileMe.avatarUrl ?? undefined} alt={profileMe.name ?? "Profile"} />
            <AvatarFallback className="bg-[#ff9D4D]/10 text-lg font-medium text-[#ff9D4D]">
              {getInitials(profileMe.name, profileMe.email)}
            </AvatarFallback>
          </Avatar>
          {profileMe.avatarUrl && (
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
            className="rounded-lg border-neutral-600 bg-neutral-800/30 px-4 py-2 text-neutral-200 shadow-sm transition-all hover:border-[#ff9D4D]/50 hover:bg-neutral-700/50 hover:text-[#ff9D4D]"
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
            <p className="text-neutral-200">{profileMe.email}</p>
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
      </div>
    </div>
  );
}
