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
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  useSettings,
  useUpdateSettings,
} from "@/src/features/account/hooks/use-settings";
import {
  updateSettingsSchema,
  type UpdateSettingsSchema,
} from "@/src/features/account/schemas/settings-schema";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Bell,
  Package,
  Shield,
  AlertCircle,
  Zap,
  Megaphone,
  Loader2,
} from "lucide-react";

export function SettingsForm() {
  const { data: settings, isLoading: isLoadingSettings } = useSettings();
  const { mutate: updateSettings, isPending: isUpdating } = useUpdateSettings();

  const form = useForm<UpdateSettingsSchema>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      notifications: {
        productUpdates: false,
        security: true,
        caseReminders: true,
        agentResults: true,
        marketing: false,
      },
      defaultOrgId: null,
      preferences: {},
    },
    values: settings
      ? {
          notifications: settings.notifications as Record<string, boolean>,
          defaultOrgId: settings.defaultOrgId,
          preferences: settings.preferences,
        }
      : undefined,
  });

  const formInitializedRef = React.useRef(false);

  // Update form when settings load
  React.useEffect(() => {
    if (settings && !formInitializedRef.current) {
      form.reset({
        notifications: settings.notifications as Record<string, boolean>,
        defaultOrgId: settings.defaultOrgId,
        preferences: settings.preferences,
      });
      formInitializedRef.current = true;
    }
  }, [settings, form]);

  function onSubmit(data: UpdateSettingsSchema) {
    const updateData: UpdateSettingsSchema = {};

    // Only include changed notification fields
    if (data.notifications) {
      const currentNotifications = (settings?.notifications || {}) as Record<
        string,
        boolean
      >;
      const changedNotifications: Record<string, boolean> = {};
      let hasChanges = false;

      for (const [key, value] of Object.entries(data.notifications)) {
        if (value !== currentNotifications[key]) {
          changedNotifications[key] = value;
          hasChanges = true;
        }
      }

      if (hasChanges) {
        updateData.notifications = data.notifications;
      }
    }

    // Check if defaultOrgId changed
    if (
      data.defaultOrgId !== undefined &&
      data.defaultOrgId !== settings?.defaultOrgId
    ) {
      updateData.defaultOrgId = data.defaultOrgId;
    }

    if (Object.keys(updateData).length > 0) {
      updateSettings(updateData);
    }
  }

  if (isLoadingSettings) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
      </div>
    );
  }

  const notificationOptions = [
    {
      name: "productUpdates" as const,
      label: "Product Updates",
      description: "Get notified about new features and improvements",
      icon: Package,
    },
    {
      name: "security" as const,
      label: "Security Alerts",
      description: "Important security notifications (recommended)",
      icon: Shield,
    },
    {
      name: "caseReminders" as const,
      label: "Case Reminders",
      description: "Reminders about your ongoing cases",
      icon: AlertCircle,
    },
    {
      name: "agentResults" as const,
      label: "Agent Results",
      description: "Notifications when AI agents complete tasks",
      icon: Zap,
    },
    {
      name: "marketing" as const,
      label: "Marketing & Promotions",
      description: "News, tips, and special offers",
      icon: Megaphone,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-transparent rounded-none md:rounded-sm border-none">
        <CardHeader className="px-0 md:px-4 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0 md:px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Notifications Section */}
              <div className="space-y-4">
                <p className="text-sm text-neutral-400">
                  Choose what notifications you'd like to receive
                </p>

                <div className="space-y-4">
                  {notificationOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <FormField
                        key={option.name}
                        control={form.control}
                        name={`notifications.${option.name}`}
                        render={({ field }) => (
                          <FormItem className="flex items-start space-x-3 space-y-0 p-4 border border-neutral-800 rounded-sm hover:border-neutral-700 transition-colors">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isUpdating}
                                className="mt-1"
                              />
                            </FormControl>
                            <div className="flex-1 space-y-1">
                              <FormLabel className="text-sm font-medium text-neutral-100 cursor-pointer flex items-center gap-2">
                                <Icon className="h-4 w-4 text-[#ff9D4D]" />
                                {option.label}
                              </FormLabel>
                              <p className="text-xs text-neutral-500">
                                {option.description}
                              </p>
                            </div>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
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
                      Saving preferences...
                    </>
                  ) : (
                    "Save Preferences"
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
