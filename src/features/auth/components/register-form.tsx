"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, registerSchema } from "../schemas/auth-schemas";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/src/components/ui/card";
import Link from "next/link";
import Wrapper from "@/src/components/shared/wrapper";
import { useRegister } from "@/src/features/auth/hook/auth";

export function RegisterForm() {
  const { mutate: Register } = useRegister();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: RegisterSchema) {
    Register(data);
    form.reset();
  }

  return (
    <Wrapper className="mx-auto ">
      <div className="w-full md:max-w-xl mx-auto">
        <Card className="bg-transparent shadow-2xl border-none py-20 rounded-none md:rounded-md">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl font-bold text-white mb-2">
              Create Account
            </CardTitle>
            <CardDescription className="text-gray-400 text-base">
              Sign up to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="sm:px-30 md:px-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-gray-200 text-[15px] font-medium">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your full name"
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
                            placeholder="Repeat your password"
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
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-13 mt-8 bg-[#FF9D4D] text-white hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base rounded-xs shadow-xs hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {form.formState.isSubmitting
                    ? "Creating Account..."
                    : "Create Account"}
                </Button>
              </form>
            </Form>
            <div className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#FF9D4D] hover:text-[#FF8D3D] transition-colors duration-200 font-medium"
              >
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Wrapper>
  );
}
