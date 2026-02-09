"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import Wrapper from "@/src/components/shared/wrapper";
import { useConfirmPasswordReset } from "@/src/features/auth/hook/use-password-reset";
import {
  confirmPasswordResetSchema,
  type ConfirmPasswordResetSchema,
} from "@/src/features/auth/schemas/password-reset-schemas";

export function ConfirmPasswordResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: confirmReset, isPending } = useConfirmPasswordReset();

  const form = useForm<ConfirmPasswordResetSchema>({
    resolver: zodResolver(confirmPasswordResetSchema),
    defaultValues: {
      token: token || "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Set token from URL params when available
  useEffect(() => {
    if (token) {
      form.setValue("token", token);
    }
  }, [token, form]);

  function onSubmit(data: ConfirmPasswordResetSchema) {
    confirmReset(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <Wrapper className="mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full md:max-w-xl mx-auto"
      >
        <Card className="bg-transparent rounded-none md:rounded-md shadow-2xl border-none py-20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Set New Password
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent className="sm:px-30 md:px-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Hidden Token Field */}
                <input type="hidden" {...form.register("token")} />

                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => {
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-[15px] font-medium">
                          New Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            disabled={form.formState.isSubmitting}
                            className="h-13 w-full bg-black border-none rounded-none text-xs text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                            {...field}
                            style={{
                              boxShadow: "inset 0 0 0 1000px #101828",
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-400" />
                      </FormItem>
                    );
                  }}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => {
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-[15px] font-medium">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm new password"
                            disabled={isPending || form.formState.isSubmitting}
                            className="h-13 w-full bg-black border-none rounded-none text-xs text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                            {...field}
                            style={{
                              boxShadow: "inset 0 0 0 1000px #101828",
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-400" />
                      </FormItem>
                    );
                  }}
                />

                {/* Password Requirements */}
                <div className="text-xs text-gray-400">
                  <p className="font-medium mb-1">Password requirements:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>At least 8 characters long</li>
                    <li>Contains at least one letter</li>
                    <li>Contains at least one number</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                  <Link href="/login">
                    <Button
                      disabled={isPending || form.formState.isSubmitting}
                      variant={"secondary"}
                      className="w-full h-13.5 mt-4 bg-gray-900 text-white rounded-xs hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Back to Login
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={
                      isPending || form.formState.isSubmitting || !token
                    }
                    className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isPending || form.formState.isSubmitting
                      ? "Resetting..."
                      : "Reset Password"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </Wrapper>
  );
}
