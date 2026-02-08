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
  useDeleteAvatar,
} from "@/src/features/account/hooks/use-profile";
import {
  updateProfileSchema,
  type UpdateProfileSchema,
} from "@/src/features/account/schemas/profile-schema";
import { User, Phone, Globe, Clock, Briefcase, Mail, Camera, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";

export function ProfileForm() {
  const { data: profile, isLoading: isLoadingProfile } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { mutate: deleteAvatar, isPending: isDeletingAvatar } = useDeleteAvatar();
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const hasLocalPreviewRef = React.useRef(false);

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

  // Track if form has been initialized to prevent unnecessary resets
  const formInitializedRef = React.useRef(false);
  const lastProfileIdRef = React.useRef<string | null>(null);

  // Update form and avatar preview when profile loads or changes
  React.useEffect(() => {
    if (profile) {
      // Check if this is a new profile (different ID) or first load
      const isNewProfile = lastProfileIdRef.current !== profile.id;
      
      if (!formInitializedRef.current || isNewProfile) {
        // Initialize form with profile data
        form.reset({
          name: profile.name || "",
          phone: profile.phone || "",
          language: profile.language,
          timezone: profile.timezone,
          accountType: profile.accountType,
        });
        formInitializedRef.current = true;
        lastProfileIdRef.current = profile.id;
        
        // Only update avatar preview if we don't have a local preview (data URL)
        if (!hasLocalPreviewRef.current) {
          setAvatarPreview(profile.avatarUrl);
        }
      } else if (formInitializedRef.current && !form.formState.isDirty) {
        // Only update if form is not dirty (user hasn't made unsaved changes)
        // This handles the case when profile is updated from another source
        const currentValues = form.getValues();
        const profileValues = {
          name: profile.name || "",
          phone: profile.phone || "",
          language: profile.language,
          timezone: profile.timezone,
          accountType: profile.accountType,
        };
        
        // Check if values are different
        const valuesChanged = 
          currentValues.name !== profileValues.name ||
          currentValues.phone !== profileValues.phone ||
          currentValues.language !== profileValues.language ||
          currentValues.timezone !== profileValues.timezone ||
          currentValues.accountType !== profileValues.accountType;
        
        if (valuesChanged) {
          form.reset(profileValues);
        }
        
        // Only update avatar preview if we don't have a local preview (data URL)
        if (!hasLocalPreviewRef.current) {
          setAvatarPreview(profile.avatarUrl);
        }
      }
    }
  }, [profile, form]);

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
    if (data.accountType !== undefined && data.accountType !== profile?.accountType) {
      updateData.accountType = data.accountType;
    }

    // Handle avatar if preview exists (would need S3 upload implementation)
    if (avatarPreview && avatarPreview !== profile?.avatarUrl && avatarPreview.startsWith('data:')) {
      // This is a local preview - in a real implementation, you'd upload to S3 first
      // For now, we'll skip this and let the user know they need to upload via S3
      // Don't clear the preview - keep it until S3 upload is implemented
    }

    if (Object.keys(updateData).length > 0) {
      // Store current avatar preview before update
      const currentPreview = avatarPreview;
      const isLocalPreview = hasLocalPreviewRef.current && currentPreview?.startsWith('data:');
      
      updateProfile(updateData, {
        onSuccess: (updatedProfile) => {
          // Keep local preview (data URL) if it exists, otherwise use updated profile avatarUrl
          if (isLocalPreview && currentPreview) {
            // Keep the local preview - don't update it
            setAvatarPreview(currentPreview);
          } else {
            // Update with the new profile avatarUrl
            setAvatarPreview(updatedProfile.avatarUrl);
            hasLocalPreviewRef.current = false; // Reset the flag
          }
        },
      });
    }
  }

  function handleAvatarDelete() {
    if (confirm("Are you sure you want to delete your avatar?")) {
      deleteAvatar(undefined, {
        onSuccess: () => {
          setAvatarPreview(null);
        },
      });
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setAvatarPreview(dataUrl);
        hasLocalPreviewRef.current = true; // Mark that we have a local preview
      };
      reader.readAsDataURL(file);

      // TODO: Upload to S3 and get URL/key, then update profile
      // For now, this is just a preview
    }
  }

  const currentAvatar = avatarPreview || profile?.avatarUrl;

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
              {/* Avatar Upload Section */}
              <div className="pb-6 border-b border-neutral-800">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUpdating}
                      className="h-11 px-5 text-sm bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Upload Avatar
                    </Button>
                    {currentAvatar && (
                      <Button
                        type="button"
                        onClick={handleAvatarDelete}
                        disabled={isDeletingAvatar || isUpdating}
                        variant="outline"
                        className="h-11 px-5 text-sm border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-xs transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Avatar
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-neutral-500">
                    Upload an image file (max 5MB). Supported formats: JPG, PNG, GIF. The avatar will appear in the sidebar after saving.
                  </p>
                  {avatarPreview && avatarPreview.startsWith('data:') && (
                    <p className="text-xs text-amber-500">
                      ✓ Image selected. Click "Save Changes" to upload to server.
                    </p>
                  )}
                </div>
              </div>

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
                  <p className="text-xs text-neutral-500">Email cannot be changed</p>
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
                              const value = e.target.value.replace(/[^\d+\-\s]/g, '');
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
                          <SelectContent side="bottom" className="bg-[#1A1A1A] border-neutral-800">
                            <SelectItem value="ka" className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]">
                              ქართული (Georgian)
                            </SelectItem>
                            <SelectItem value="en" className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]">
                              English
                            </SelectItem>
                            <SelectItem value="ru" className="text-neutral-100 data-highlighted:bg-[#2B2925] data-highlighted:text-[#ff9D4D]">
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

