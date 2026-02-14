"use client";

import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import Wrapper from "@/src/components/shared/wrapper";
import { useConfirmEmailVerification } from "@/src/features/auth/hook/use-email-verification";
import {
  confirmEmailVerificationSchema,
  type ConfirmEmailVerificationSchema,
} from "@/src/features/auth/schemas/email-verification-schemas";
import Link from "next/link";

export function ConfirmEmailForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { mutate: confirmEmail, isPending } = useConfirmEmailVerification();

  const form = useForm<ConfirmEmailVerificationSchema>({
    resolver: zodResolver(confirmEmailVerificationSchema),
    defaultValues: {
      token: token || "",
    },
  });

  // Set token from URL params when available and auto-submit
  useEffect(() => {
    if (token) {
      form.setValue("token", token);
      // Auto-submit when token is available
      setTimeout(() => {
        confirmEmail({ token });
      }, 500);
    }
  }, [token, form, confirmEmail]);

  function onSubmit(data: ConfirmEmailVerificationSchema) {
    confirmEmail(data, {
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
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              {isPending
                ? "Verifying your email..."
                : "Confirming your email address"}
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

                {/* Instructions */}
                {isPending ? (
                  <div className="text-center py-6">
                    <div className="inline-block">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9D4D]"></div>
                    </div>
                    <p className="text-gray-400 mt-4">
                      Please wait while we verify your email...
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 mb-6">
                      Click the button below to confirm your email address
                    </p>

                    {/* Submit Button */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                      <Link href="/login">
                        <Button
                          type="button"
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
                          ? "Verifying..."
                          : "Verify Email"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </Wrapper>
  );
}
