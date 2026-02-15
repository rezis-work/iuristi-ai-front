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
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { usePasswordChange } from "../hook/change-password";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "../schemas/passwordChnage-schema";

export function PasswordChnage() {
  const { mutate: changePassword, isPending } = usePasswordChange();

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  function onSubmit(data: ChangePasswordInput) {
    changePassword(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-800/50 p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ff9D4D]/10">
          <Lock className="h-5 w-5 text-[#ff9D4D]" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-neutral-100">
            Change Password
          </h2>
          <p className="text-sm text-neutral-500">
            Update your account password for security
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-neutral-100">
                  Current password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your current password"
                    disabled={isPending}
                    className="h-11 rounded-lg border-neutral-600 bg-neutral-800/50 focus-visible:ring-[#ff9D4D]/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-neutral-100">
                  New password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter new password (min. 8 chars, letter and number)"
                    disabled={isPending}
                    className="h-11 rounded-lg border-neutral-600 bg-neutral-800/50 focus-visible:ring-[#ff9D4D]/50"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 rounded-lg bg-[#ff9D4D] font-semibold text-white shadow-md transition-all hover:bg-[#ff8D3D] hover:shadow-lg disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing...
              </>
            ) : (
              "Change password"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
