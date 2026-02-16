"use client";

import { useEffect } from "react";
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
import { Checkbox } from "@/src/components/ui/checkbox";
import Wrapper from "@/src/components/shared/wrapper";
import { useLogin } from "@/src/features/auth/hook/auth";
import { useLocalStorage } from "../hook/useLocalStorage";

interface LoginFormProps {
  onClose?: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const { mutate: Login } = useLogin({
    disableAutoRedirect: true,
    redirectTo: nextParam || undefined,
  });
  const [savedEmail, setSavedEmail, clearSavedEmail, isLoading] =
    useLocalStorage<string>("login_email", "");

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Load saved email after localStorage is ready
  useEffect(() => {
    if (!isLoading && savedEmail) {
      form.reset({
        email: savedEmail,
        password: "",
        rememberMe: true,
      });
    }
  }, [isLoading, savedEmail, form]);

  function onSubmit(data: LoginSchema) {
    // Handle remember me functionality
    if (data.rememberMe) {
      setSavedEmail(data.email);
    } else {
      clearSavedEmail();
    }

    // Pass the full data object - login API will remove rememberMe
    Login(data, {
      onSuccess: () => {
        form.reset({
          email: "",
          password: "",
          rememberMe: false,
        });
        // Close the dropdown after successful login
        if (onClose) {
          setTimeout(() => {
            onClose();
          }, 100);
        }
      },
    });
  }

  return (
    <Wrapper className="mx-auto">
      <div className="w-full md:max-w-xl mx-auto">
        <Card className="bg-transparent rounded-none md:rounded-md shadow-2xl border-none py-20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-white mb-2">
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
                <div className="text-gray-200 flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            id="remember"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="w-5 h-5 min-h-5 max-h-5 shrink-0 border-none cursor-pointer rounded-none bg-gray-700 data-[state=checked]:bg-[#FF9D4D] p-0 flex items-center justify-center"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="remember"
                          className="text-[15px] cursor-pointer select-none"
                        >
                          Remember me
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                  <Link
                    href={"/reset-password"}
                    className="cursor-pointer text-[15px]"
                  >
                    Forgot password?
                  </Link>
                </div>
                {/* Submit Button */}
                <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                  <Link
                    href={nextParam ? `/register?next=${encodeURIComponent(nextParam)}` : "/register"}
                    className="text-[#FF9D4D] hover:text-[#FF8D3D] transition-colors duration-200 font-medium"
                    onClick={onClose}
                  >
                    <Button
                      variant={"secondary"}
                      className="w-full h-13.5 mt-4 bg-gray-900 text-white rounded-xs hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Sign up
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {form.formState.isSubmitting ? "Signing in..." : "Login"}
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
