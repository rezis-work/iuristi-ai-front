"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
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
import { useRequestEmailVerification } from "@/src/features/auth/hook/use-email-verification";
import {
  requestEmailVerificationSchema,
  type RequestEmailVerificationSchema,
} from "@/src/features/auth/schemas/email-verification-schemas";
import { CheckCircle2, Mail } from "lucide-react";

export function VerifyEmailForm() {
  const { mutate: requestVerification, isPending } =
    useRequestEmailVerification();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<RequestEmailVerificationSchema>({
    resolver: zodResolver(requestEmailVerificationSchema),
    defaultValues: {},
  });

  function onSubmit() {
    requestVerification(
      {},
      {
        onSuccess: () => {
          setSubmitted(true);
          form.reset();
        },
      },
    );
  }

  // Success state
  if (submitted) {
    return (
      <Wrapper className="mx-auto">
        <div className="w-full md:max-w-xl mx-auto">
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
                We've sent a verification link to your email address
              </CardDescription>
            </CardHeader>
            <CardContent className="sm:px-30 md:px-4 space-y-6">
              {/* Instructions */}
              <div className="space-y-4 text-sm text-gray-400">
                <p className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#FF9D4D] shrink-0 mt-0.5" />
                  <span>
                    Click the link in the email to verify your email address.
                    The link expires in 60 minutes.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-[#FF9D4D] shrink-0">📁</span>
                  <span>
                    Check your spam or junk folder if you don't see it in your
                    inbox.
                  </span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-[#FF9D4D] shrink-0">⏱️</span>
                  <span>
                    You can request a new verification email after 60 seconds.
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
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    );
  }

  // Form state
  return (
    <Wrapper className="mx-auto">
      <div className="w-full md:max-w-xl mx-auto">
        <Card className="bg-transparent rounded-none md:rounded-md shadow-2xl border-none py-20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Confirm your email address to unlock all features
            </CardDescription>
          </CardHeader>
          <CardContent className="sm:px-30 md:px-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isPending ? "Sending..." : "Send Verification Email"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
