"use client";

import * as React from "react";
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
import { UnderlinedFieldWrapper } from "@/src/features/account/components/UnderlinedFieldWrapper";
import {
  useProfile,
  useUpdateProfile,
} from "@/src/features/account/hooks/use-profile";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "@/src/features/account/schemas/profile-schema";
import {
  User,
  Phone,
  Globe,
  Clock,
  Briefcase,
  Mail,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

export function ProfileForm() {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  console.log(profile);

  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const form = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
      language: "ka",
      timezone: "Asia/Tbilisi",
      accountType: "person",
    },
    values: profile
      ? {
          name: profile.name || "",
          phone: profile.phone || "",
          language: profile.language,
          timezone: profile.timezone,
          accountType: profile.accountType,
        }
      : undefined,
  });

  function onSubmit(data: UpdateProfileSchema) {
    const updateData: UpdateProfileSchema = {};

    // Only include changed fields
    if (data.name !== undefined && data.name !== profile?.name) {
      // Convert empty string to undefined (which will be sent as null by backend)
      updateData.name = data.name === "" ? undefined : data.name;
    }
    if (data.phone !== undefined && data.phone !== profile?.phone) {
      // Convert empty string to undefined (which will be sent as null by backend)
      updateData.phone = data.phone === "" ? undefined : data.phone;
    }
    if (data.language !== undefined && data.language !== profile?.language) {
      updateData.language = data.language;
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
      updateProfile(updateData);
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
    <div className="space-y-6">
      <Card className="bg-transparent rounded-none md:rounded-sm border-none">
        <CardHeader className="px-0 md:px-4 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100">
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Grid Layout for Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email (Display only) */}
                <div className="space-y-2">
                  <label className="text-gray-200 text-[15px] font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <div className="h-10 flex items-center px-0">
                    <p className="text-xs md:text-sm font-medium text-neutral-300">
                      {profile?.email || "-"}
                    </p>
                  </div>
                  <p className="text-xs text-neutral-500">
                    Email cannot be changed
                  </p>
                </div>

                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200 text-[15px] font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <UnderlinedFieldWrapper error={!!fieldState.error}>
                          <Input
                            placeholder="Enter your full name"
                            disabled={isUpdating}
                            className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
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
                      <FormLabel className="text-gray-200 text-[15px] font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <UnderlinedFieldWrapper error={!!fieldState.error}>
                          <Input
                            type="tel"
                            inputMode="tel"
                            placeholder="+995555123456"
                            disabled={isUpdating}
                            className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                            style={{
                              boxShadow: "inset 0 0 0 1000px #181818",
                            }}
                            {...field}
                            onChange={(e) => {
                              // Allow only numbers, +, - symbols and spaces
                              const value = e.target.value.replace(
                                /[^\d+\-\s]/g,
                                "",
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

                {/* Language */}
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200 text-[15px] font-medium flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Language
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent
                            side="bottom"
                            className="bg-[#1A1A1A] border-neutral-800"
                          >
                            <SelectItem
                              value="ka"
                              className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]"
                            >
                              ქართული (Georgian)
                            </SelectItem>
                            <SelectItem
                              value="en"
                              className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]"
                            >
                              English
                            </SelectItem>
                            <SelectItem
                              value="ru"
                              className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]"
                            >
                              Русский (Russian)
                            </SelectItem>
                          </SelectContent>
                        </Select>
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
                      <FormLabel className="text-gray-200 text-[15px] font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Timezone
                      </FormLabel>
                      <FormControl>
                        <UnderlinedFieldWrapper error={!!fieldState.error}>
                          <Input
                            placeholder="Asia/Tbilisi"
                            disabled={isUpdating}
                            className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
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
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200 text-[15px] font-medium flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Account Type
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={isUpdating}
                        >
                          <SelectTrigger className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none shadow-none">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-neutral-800">
                            <SelectItem
                              value="person"
                              className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]"
                            >
                              Person
                            </SelectItem>
                            <SelectItem
                              value="lawyer"
                              className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]"
                            >
                              Lawyer
                            </SelectItem>
                            <SelectItem
                              value="business_owner"
                              className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]"
                            >
                              Business Owner
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage className="text-sm text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isUpdating || form.formState.isSubmitting}
                  className="w-full h-11 lg:h-12 px-5 text-sm bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isUpdating || form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
