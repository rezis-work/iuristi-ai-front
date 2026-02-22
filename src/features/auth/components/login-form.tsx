"use client";

import { useForm } from "react-hook-form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../schemas/auth-schemas";
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
import { useLogin } from "@/src/features/auth/hook/auth";

interface LoginFormProps {
  onClose?: () => void;
  next?: string;
  compact?: boolean;
}

export function LoginForm({ onClose, next: nextProp, compact }: LoginFormProps) {
  const searchParams = useSearchParams();
  const nextFromUrl = searchParams.get("next");
  const nextParam = nextProp ?? nextFromUrl;
  const { mutate: Login } = useLogin({
    disableAutoRedirect: true,
    redirectTo: nextParam || undefined,
  });

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: LoginSchema) {
    Login(data, {
      onSuccess: () => {
        form.reset({ email: "", password: "" });
        if (onClose) {
          setTimeout(onClose, 100);
        }
      },
    });
  }

  const content = (
    <div className={compact ? "w-full" : "w-full md:max-w-xl mx-auto"}>
      <Card className={`bg-transparent rounded-none md:rounded-md shadow-2xl border-none ${compact ? "pt-12 pb-4 px-6" : "py-20"}`}>
          <CardHeader className={`text-center ${compact ? "pb-3" : "pb-4"}`}>
            <CardTitle className={`font-bold text-white mb-2 ${compact ? "text-2xl" : "text-3xl"}`}>
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Sign in to your account
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

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-[15px] font-medium">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
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
                <div className="text-gray-200 flex justify-end">
                  <Link
                    href="/reset-password"
                    className="cursor-pointer text-[15px] hover:text-[#FF9D4D] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                {/* Submit Button */}
                <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {form.formState.isSubmitting ? "Signing in..." : "Login"}
                  </Button>
                  <Link
                    href={nextParam ? `/register?next=${encodeURIComponent(nextParam)}` : "/register"}
                    className="text-[#FF9D4D] hover:text-[#FF8D3D] transition-colors duration-200 font-medium"
                    onClick={() => onClose?.()}
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full h-13.5 mt-4 bg-gray-900 text-white rounded-xs hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
  );

  return compact ? content : <Wrapper className="mx-auto">{content}</Wrapper>;
}
