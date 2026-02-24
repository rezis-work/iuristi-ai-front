"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { UnderlinedFieldWrapper } from "@/src/components/shared/UnderlinedFieldWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { useGetMe, useUpdateProfile, useDeleteAvatar } from "../hooks/profile-api";
import { uploadImage } from "@/src/components/upload/api/upload-image";
import { toast } from "sonner";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "../schemas/profile-schema";
import { User, Phone, Clock, Briefcase, Mail, Loader2, ImagePlus, Trash2, ChevronDown } from "lucide-react";
import type { Profile } from "../api/profile-api";

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

const PROFILE_TYPE_OPTIONS: { value: Profile["accountType"]; label: string }[] = [
  { value: "person", label: "პიროვნება" },
  { value: "lawyer", label: "იურისტი" },
  { value: "business_owner", label: "ბიზნესის მფლობელი" },
];

/** Normalize accountType from API (may return "Person" etc.) to our expected values */
function normalizeAccountType(val: unknown): Profile["accountType"] {
  if (!val || typeof val !== "string") return "person";
  const v = String(val).toLowerCase().replace(/\s+/g, "_");
  if (v === "lawyer") return "lawyer";
  if (v === "business_owner" || v === "businessowner") return "business_owner";
  return "person";
}

interface ProfileEditFormProps {
  onSuccess?: () => void;
}

export default function ProfileEditForm({ onSuccess }: ProfileEditFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: profile, isLoading: isLoadingProfile } = useGetMe();
  const updateProfileMutation = useUpdateProfile();
  const deleteAvatar = useDeleteAvatar();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const { fileUrl, key } = await uploadImage(file, "avatar");
      await updateProfileMutation.mutateAsync({ avatarUrl: fileUrl, avatarKey: key });
      toast.success("პროფილის ფოტო წარმატებით ატვირთულია");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ატვირთვა ვერ მოხერხდა");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  }

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      timezone: "Asia/Tbilisi",
      accountType: "person",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        phone: profile.phone || "",
        timezone: profile.timezone,
        accountType: normalizeAccountType(profile.accountType),
      });
    }
  }, [profile, form]);

  function onSubmit(data: UpdateProfileSchema) {
    const updateData: UpdateProfileSchema = {};

    if (data.name !== undefined && data.name !== profile?.name) {
      updateData.name = data.name === "" ? undefined : data.name;
    }
    if (data.phone !== undefined && data.phone !== profile?.phone) {
      updateData.phone = data.phone === "" ? undefined : data.phone;
    }
    if (data.timezone !== undefined && data.timezone !== profile?.timezone) {
      updateData.timezone = data.timezone;
    }
    if (
      data.accountType !== undefined &&
      data.accountType !== profile?.accountType
    ) {
      updateData.accountType = data.accountType;
    }

    if (Object.keys(updateData).length > 0) {
      updateProfileMutation.mutate(updateData, {
        onSuccess: () => {
          toast.success("პროფილი წარმატებით განახლდა");
          onSuccess?.();
        },
      });
    } else {
      onSuccess?.();
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 overflow-x-hidden">
        <div className="grid grid-cols-1 gap-5">
          {/* Avatar upload / delete */}
          <div className="space-y-4">
            <label className="block font-medium text-neutral-200">
              პროფილის ფოტო
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50 min-w-0">
              <div className="relative shrink-0">
                <Avatar className="h-24 w-24 sm:h-28 sm:w-28 border-2 border-[#ff9D4D]/50 ring-2 ring-neutral-700/50">
                  <AvatarImage src={profile?.avatarUrl ?? undefined} alt={profile?.name ?? "პროფილი"} className="object-cover" />
                  <AvatarFallback className="bg-[#ff9D4D]/15 text-2xl font-semibold text-[#ff9D4D]">
                    {getInitials(profile?.name ?? null, profile?.email ?? "")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[200px]">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  onChange={handleAvatarUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto cursor-pointer gap-2 border-[#ff9D4D]/50 bg-neutral-800 hover:bg-[#ff9D4D]/10 hover:border-[#ff9D4D] text-neutral-200 disabled:cursor-not-allowed"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || updateProfileMutation.isPending}
                >
                  {isUploading || updateProfileMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ImagePlus className="h-4 w-4" />
                  )}
                  ატვირთვა
                </Button>
                {profile?.avatarUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto cursor-pointer gap-2 border-red-500/50 bg-neutral-800 hover:bg-red-500/10 hover:border-red-500 text-red-400 hover:text-red-300 disabled:cursor-not-allowed"
                    onClick={() => deleteAvatar.mutate()}
                    disabled={deleteAvatar.isPending}
                  >
                    {deleteAvatar.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    წაშლა
                  </Button>
                )}
                <p className="text-xs text-neutral-500">
                  PNG, JPEG ან WebP. მაქს 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Email (Display only) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-neutral-200">
              <Mail className="h-4 w-4" />
              ელფოსტა
            </label>
            <p className="text-sm text-neutral-400">{profile?.email || "-"}</p>
            <p className="text-xs text-neutral-500">ელფოსტის შეცვლა შეუძლებელია</p>
          </div>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 font-medium text-neutral-200">
                  <User className="h-4 w-4" />
                  სრული სახელი
                </FormLabel>
                <FormControl>
                  <UnderlinedFieldWrapper error={!!fieldState.error}>
                    <Input
                      placeholder="შეიყვანეთ თქვენი სახელი"
                      disabled={updateProfileMutation.isPending}
                      className="h-10 w-full border-0 bg-transparent px-0 pr-7 text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{
                        boxShadow: "inset 0 0 0 1000px #181818",
                      }}
                      {...field}
                    />
                  </UnderlinedFieldWrapper>
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          {/* Phone */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 font-medium text-neutral-200">
                  <Phone className="h-4 w-4" />
                  ტელეფონის ნომერი
                </FormLabel>
                <FormControl>
                  <UnderlinedFieldWrapper error={!!fieldState.error}>
                    <Input
                      type="tel"
                      placeholder="+995555123456"
                      disabled={updateProfileMutation.isPending}
                      className="h-10 w-full border-0 bg-transparent px-0 pr-7 text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{
                        boxShadow: "inset 0 0 0 1000px #181818",
                      }}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(
                          /[^\d+\-\s]/g,
                          ""
                        );
                        field.onChange(value);
                      }}
                    />
                  </UnderlinedFieldWrapper>
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          {/* Timezone */}
          <FormField
            control={form.control}
            name="timezone"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 font-medium text-neutral-200">
                  <Clock className="h-4 w-4" />
                  დროის სარტყელი
                </FormLabel>
                <FormControl>
                  <UnderlinedFieldWrapper error={!!fieldState.error}>
                    <Input
                      placeholder="Asia/Tbilisi"
                      disabled={updateProfileMutation.isPending}
                      className="h-10 w-full border-0 bg-transparent px-0 pr-7 text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{
                        boxShadow: "inset 0 0 0 1000px #181818",
                      }}
                      {...field}
                    />
                  </UnderlinedFieldWrapper>
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          {/* Account Type */}
          <FormField
            control={form.control}
            name="accountType"
            render={({ field, fieldState }) => {
              const currentValue = field.value ?? "person";
              const currentLabel =
                PROFILE_TYPE_OPTIONS.find((o) => o.value === currentValue)?.label ?? "აირჩიეთ ტიპი";
              return (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-2 font-medium text-neutral-200">
                    <Briefcase className="h-4 w-4" />
                    ანგარიშის ტიპი
                  </FormLabel>
                  <FormControl>
                    <UnderlinedFieldWrapper error={!!fieldState.error}>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          disabled={updateProfileMutation.isPending}
                        >
                          <button
                            type="button"
                            className="flex h-10 w-full min-w-0 cursor-pointer items-center justify-between border-0 bg-transparent px-0 pr-7 text-left text-sm font-medium text-neutral-100 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                            style={{
                              boxShadow: "inset 0 0 0 1000px #181818",
                            }}
                          >
                            <span className={currentValue ? "text-neutral-100" : "text-neutral-600"}>
                              {currentLabel}
                            </span>
                            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="start"
                          className="min-w-32 border-neutral-800 bg-[#1A1A1A]"
                        >
                          {PROFILE_TYPE_OPTIONS.map((opt) => (
                            <DropdownMenuItem
                              key={opt.value}
                              className="cursor-pointer text-neutral-100 focus:bg-[#2B2925] focus:text-[#ff9D4D]"
                              onSelect={() => field.onChange(opt.value)}
                            >
                              {opt.label}
                              {opt.value === currentValue && (
                                <span className="ml-auto text-[#ff9D4D]">✓</span>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </UnderlinedFieldWrapper>
                  </FormControl>
                  <FormMessage className="text-sm text-red-400" />
                </FormItem>
              );
            }}
          />
        </div>

        <Button
          type="submit"
          disabled={updateProfileMutation.isPending || form.formState.isSubmitting}
          className="h-11 w-full cursor-pointer rounded-lg bg-[#FF9D4D] px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.01] hover:bg-[#FF8D3D] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateProfileMutation.isPending || form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ინახება...
            </>
          ) : (
            "ცვლილებების შენახვა"
          )}
        </Button>
      </form>
    </Form>
  );
}
