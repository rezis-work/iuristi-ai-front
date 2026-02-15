"use client";

import React from "react";
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
import { Switch } from "@/src/components/ui/switch";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useSettings, useUpdateSettings } from "../hooks/settings";
import {
  updateSettingsSchema,
  type UpdateSettingsSchema,
} from "@/src/features/user-account/profile/schemas/settings-schema";
import {
  Bell,
  Loader2,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { NOTIFICATION_OPTIONS } from "../lib/notification";



export default function Seetings() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings({
    messages: {
      success: "Settings updated successfully",
      error: "Failed to save settings",
    },
  });

  const defaultNotifications = Object.fromEntries(
    NOTIFICATION_OPTIONS.map((opt) => [opt.name, false]),
  ) as Record<string, boolean>;

  const toCamel = (s: string) =>
    s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  const apiNotifications = (settings?.notifications || {}) as Record<
    string,
    boolean
  >;
  const normalizedNotifications = {
    ...defaultNotifications,
    ...Object.fromEntries(
      Object.entries(apiNotifications).map(([k, v]) => [toCamel(k), v]),
    ),
  };

  const form = useForm<UpdateSettingsSchema>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      notifications: defaultNotifications,
      defaultOrgId: null,
      preferences: {},
    },
    values: settings
      ? {
          notifications: normalizedNotifications,
          defaultOrgId: settings.defaultOrgId ?? null,
          preferences: settings.preferences ?? {},
        }
      : undefined,
  });

  function onSubmit(data: UpdateSettingsSchema) {
    const updateData: UpdateSettingsSchema = {};
    const currentNotifications = normalizedNotifications;

    if (data.notifications) {
      const changedNotifications: Record<string, boolean> = {};
      let hasChanges = false;
      for (const [key, value] of Object.entries(data.notifications)) {
        if (value !== currentNotifications[key]) {
          changedNotifications[key] = value;
          hasChanges = true;
        }
      }
      if (hasChanges) updateData.notifications = data.notifications;
    }

    if (data.defaultOrgId !== undefined && data.defaultOrgId !== settings?.defaultOrgId) {
      updateData.defaultOrgId = data.defaultOrgId;
    }

    if (Object.keys(updateData).length === 0) {
      toast.info("ცვლილებები არ მოიძებნა");
      return;
    }

    updateSettings.mutate(updateData);
  }

  if (isLoading) {
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="mt-6 h-11 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff9D4D]/10">
          <Settings2 className="h-5 w-5 text-[#ff9D4D]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-100">პარამეტრები</h2>
          <p className="text-sm text-neutral-500">მართეთ შეტყობინებების პრეფერენციები</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-neutral-300">
              <Bell className="h-4 w-4 text-[#ff9D4D]" />
              <span className="text-sm font-medium">შეტყობინებები</span>
            </div>
            <p className="text-xs text-neutral-500 pl-6">
              აირჩიეთ როგორი შეტყობინებები გსურთ მიღება
            </p>
          </div>

          <div className="space-y-3">
            {NOTIFICATION_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <FormField
                  key={option.name}
                  control={form.control}
                  name={`notifications.${option.name}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between gap-4 rounded-lg border border-neutral-700/80 bg-neutral-800/30 p-4 transition-colors hover:border-neutral-600 hover:bg-neutral-800/50">
                      <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-700/50">
                          <Icon className="h-4 w-4 text-[#ff9D4D]" />
                        </div>
                        <div className="space-y-1">
                          <FormLabel className="text-sm font-medium text-neutral-100 cursor-pointer">
                            {option.label}
                          </FormLabel>
                          <p className="text-xs text-neutral-500">{option.description}</p>
                        </div>
                      </div>
                      <FormControl>
                        <Switch
                          checked={Boolean(field.value)}
                          onCheckedChange={(checked) => field.onChange(checked)}
                          disabled={updateSettings.isPending}
                          className="data-[state=checked]:bg-[#ff9D4D] data-[state=checked]:hover:bg-[#FF8D3D] transition-colors duration-300 ease-in-out"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={updateSettings.isPending}
              className="w-full h-11 rounded-lg bg-[#ff9D4D] font-semibold text-white shadow-md transition-all hover:bg-[#ff8D3D] hover:shadow-lg disabled:opacity-50"
            >
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ინახება...
                </>
              ) : (
                "პარამეტრების შენახვა"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
