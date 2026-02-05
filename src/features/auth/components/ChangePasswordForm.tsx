"use client";

import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import Wrapper from "@/src/components/shared/wrapper";
import { useChangePassword } from "@/src/features/auth/hook/auth";

export function ChangePasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from") || "/login";
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
    <Wrapper className="mx-auto">
      <div className="w-full md:max-w-xl mx-auto">
        <Card className="bg-transparent rounded-none md:rounded-md shadow-2xl border-none py-20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Change Password
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent className="sm:px-30 md:px-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Current password */}
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200 text-[15px] font-medium">
                        Current password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your current password"
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
                  )}
                />

                {/* New password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200 text-[15px] font-medium">
                        New password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
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
                  )}
                />

                {/* Confirm new password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-200 text-[15px] font-medium">
                        Confirm new password
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
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
                  )}
                />
                <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push(from)}
                    className="w-full h-13.5 mt-4 bg-gray-900 text-white rounded-xs hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Back to login
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending || form.formState.isSubmitting}
                    className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
    </Wrapper>
  );
}
