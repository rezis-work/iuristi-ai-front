"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "@/src/features/auth/schemas/auth-schemas";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { useChangePassword } from "@/src/features/auth/hook/auth";
import { User } from "lucide-react";

type UnderlinedFieldWrapperProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  error?: boolean;
};

function UnderlinedFieldWrapper({
  children,
  icon,
  error,
}: UnderlinedFieldWrapperProps) {
  const hasError = !!error;

  return (
    <div className="relative group">
      {children}
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-neutral-800" />
      <span
        className={[
          "pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left",
          hasError
            ? "bg-red-500 scale-x-100"
            : "bg-linear-to-r from-[#ff9D4D] to-[#ff9D4D] scale-x-0 group-focus-within:scale-x-100 group-hover:scale-x-100 transition-transform duration-300 ease-out",
        ].join(" ")}
      />
      {icon && (
        <span
          className={[
            "pointer-events-none absolute right-0 top-1/2 -translate-y-1/2",
            hasError
              ? "text-red-400"
              : "text-zinc-500 group-hover:text-[#ff9D4D] transition-colors",
          ].join(" ")}
        >
          {icon}
        </span>
      )}
    </div>
  );
}

export function ChangePasswordForm() {
  const { mutate: changePassword, isPending } = useChangePassword();

  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: ChangePasswordSchema) {
    changePassword(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <div>
      <Card className="bg-transparent rounded-none md:rounded-sm border-none">
        <CardContent className="px-0 md:px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current password */}
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-200 text-[15px] font-medium">
                      Current password
                    </FormLabel>
                    <FormControl>
                      <UnderlinedFieldWrapper
                        icon={<User className="w-4 h-4" />}
                        error={!!fieldState.error}
                      >
                        <Input
                          autoComplete="given"
                          type="password"
                          placeholder="Enter your current password"
                          disabled={isPending}
                          className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                          {...field}
                          style={{
                            boxShadow: "inset 0 0 0 1000px #181818",
                          }}
                        />
                      </UnderlinedFieldWrapper>
                    </FormControl>
                    <FormMessage className="text-sm text-red-400" />
                  </FormItem>
                )}
              />

              {/* New password */}
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-200 text-[15px] font-medium">
                      New password
                    </FormLabel>
                    <FormControl>
                      <UnderlinedFieldWrapper
                        icon={<User className="w-4 h-4" />}
                        error={!!fieldState.error}
                      >
                        <Input
                          autoComplete="given"
                          type="password"
                          placeholder="Enter your new password"
                          disabled={isPending}
                          className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                          {...field}
                          style={{
                            boxShadow: "inset 0 0 0 1000px #181818",
                          }}
                        />
                      </UnderlinedFieldWrapper>
                    </FormControl>
                    <FormMessage className="text-sm text-red-400" />
                  </FormItem>
                )}
              />

              {/* Confirm new password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-200 text-[15px] font-medium">
                      Confirm new password
                    </FormLabel>
                    <FormControl>
                      <UnderlinedFieldWrapper
                        icon={<User className="w-4 h-4" />}
                        error={!!fieldState.error}
                      >
                        <Input
                          autoComplete="given"
                          type="password"
                          placeholder="Confirm your new password"
                          disabled={isPending}
                          className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                          {...field}
                          style={{
                            boxShadow: "inset 0 0 0 1000px #181818",
                          }}
                        />
                      </UnderlinedFieldWrapper>
                    </FormControl>
                    <FormMessage className="text-sm text-red-400" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-7 items-center">
                <Button
                  type="submit"
                  disabled={isPending || form.formState.isSubmitting}
                  className="w-full h-11 lg:h-12 px-5 mt-4 text-sm bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isPending || form.formState.isSubmitting
                    ? "Changing password..."
                    : "Change password"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
