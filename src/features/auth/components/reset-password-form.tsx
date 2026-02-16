"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
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
import { useRequestPasswordReset } from "@/src/features/auth/hook/use-password-reset";
import {
  requestPasswordResetSchema,
  type RequestPasswordResetSchema,
} from "@/src/features/auth/schemas/password-reset-schemas";
import { CheckCircle2, Mail } from "lucide-react";
import { motion } from "motion/react";

export function ResetPasswordForm() {
  const { mutate: requestReset, isPending } = useRequestPasswordReset();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<RequestPasswordResetSchema>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: RequestPasswordResetSchema) {
    requestReset(data, {
      onSuccess: () => {
        setSubmittedEmail(data.email);
        setSubmitted(true);
        form.reset();
      },
    });
  }

  // Success state
  if (submitted) {
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
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-900/30 rounded-full">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                Check Your Email
              </CardTitle>
              <CardDescription className="text-gray-400 text-base">
                We&apos;ve sent a password reset link to{" "}
                <span className="text-gray-300 font-medium">
                  {submittedEmail}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="sm:px-30 md:px-4 space-y-6">
              {/* Instructions */}
              <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#FF9D4D] shrink-0 mt-0.5" />
                  <span>
                    Click the link in the email to reset your password. The link
                    expires in 30 minutes.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-[#FF9D4D] shrink-0">📁</span>
                  <span>
                    Check your spam or junk folder if you don&apos;t see it in your
                    inbox.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-[#FF9D4D] shrink-0">⏱️</span>
                  <span>
                    You can request a new reset email after 60 seconds.
                  </span>
                </p>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-500">Or</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => setSubmitted(false)}
                  type="button"
                  className="w-full h-13 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Try Another Email
                </Button>
                <Link href="/login" className="block">
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full h-13 bg-gray-900 text-white rounded-xs hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </Wrapper>
    );
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
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Enter your email to receive a password reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="sm:px-30 md:px-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-[15px] font-medium">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter your email"
                            disabled={isPending}
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

                {/* Submit Button */}
                <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                  <Link href="/login">
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full h-13.5 mt-4 bg-gray-900 text-white rounded-xs hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Back to Login
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isPending ? "Sending..." : "Send Reset Link"}
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
