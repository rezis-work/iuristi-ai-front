"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { UnderlinedFieldWrapper } from "@/src/components/shared/UnderlinedFieldWrapper";
import { useGetMe, useUpdateProfile } from "../hooks/profile-api";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "../schemas/profile-schema";
import { User, Phone, Clock, Briefcase, Mail, Loader2 } from "lucide-react";
import type { Profile } from "../api/profile-api";

const PROFILE_TYPE_OPTIONS: { value: Profile["accountType"]; label: string }[] = [
  { value: "person", label: "Person" },
  { value: "lawyer", label: "Lawyer" },
  { value: "business_owner", label: "Business Owner" },
];

interface ProfileEditFormProps {
  onSuccess?: () => void;
}

export default function ProfileEditForm({ onSuccess }: ProfileEditFormProps) {
  const { data: profile, isLoading: isLoadingProfile } = useGetMe();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      timezone: "Asia/Tbilisi",
      accountType: "person",
    },
    values: profile
      ? {
          name: profile.name || "",
          phone: profile.phone || "",
          timezone: profile.timezone,
          accountType: profile.accountType,
        }
      : undefined,
  });

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
        onSuccess: () => onSuccess?.(),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {/* Email (Display only) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 font-medium text-neutral-200">
              <Mail className="h-4 w-4" />
              Email
            </label>
            <p className="text-sm text-neutral-400">{profile?.email || "-"}</p>
            <p className="text-xs text-neutral-500">Email cannot be changed</p>
          </div>

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 font-medium text-neutral-200">
                  <User className="h-4 w-4" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <UnderlinedFieldWrapper error={!!fieldState.error}>
                    <Input
                      placeholder="Enter your name"
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
                  Phone Number
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
                  Timezone
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
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="flex items-center gap-2 font-medium text-neutral-200">
                  <Briefcase className="h-4 w-4" />
                  Account Type
                </FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={updateProfileMutation.isPending}
                  >
                    <SelectTrigger className="h-10 w-full border-0 bg-transparent px-0 pr-7 text-sm font-medium text-neutral-100 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="border-neutral-800 bg-[#1A1A1A]">
                      {PROFILE_TYPE_OPTIONS.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={updateProfileMutation.isPending || form.formState.isSubmitting}
          className="h-11 w-full rounded-lg bg-[#FF9D4D] px-5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.01] hover:bg-[#FF8D3D] hover:shadow-lg active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateProfileMutation.isPending || form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
