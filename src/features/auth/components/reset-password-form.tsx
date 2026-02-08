"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
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

export function ResetPasswordForm() {
  const { mutate: requestReset } = useRequestPasswordReset();

  const form = useForm<RequestPasswordResetSchema>({
    resolver: zodResolver(requestPasswordResetSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: RequestPasswordResetSchema) {
    requestReset(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <Wrapper className="mx-auto">
      <div className="w-full md:max-w-xl mx-auto">
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

                {/* Submit Button */}
                <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                  <Link href="/login">
                    <Button
                      variant={"secondary"}
                      className="w-full h-13.5 mt-4 bg-gray-900 text-white rounded-xs hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Back to Login
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {form.formState.isSubmitting
                      ? "Sending..."
                      : "Send Reset Link"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
