"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import Map from "@/src/components/shared/Map";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Send, Phone, Mail, User } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "The field is required."),
  lastName: z.string().min(2, "The field is required."),
  email: z.string().email("The field is required."),
  phone: z
    .string()
    .min(10, "The field is required.")
    .regex(/^\+?[\d\s-()]{10,}$/, "Please enter a valid phone number."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormValues = z.infer<typeof formSchema>;

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

export default function ContactMapSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      console.log("Contact form submitted:", data);

      toast.success("Message sent successfully!", {
        description: "We will get back to you shortly.",
      });

      setSubmitted(true);
      form.reset();
    } catch {
      toast.error("Failed to send message.", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/5 right-1/5 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>
      <div className="relative flex flex-col lg:flex-row h-auto w-full">
        <div className="w-full lg:w-1/2 bg-zinc-900 shrink-0 h-80 lg:h-auto relative border-none">
          <Map lat={40.70582497139078} lng={-74.01437792445523} zoom={14} />
        </div>
        <div className="bg-zinc-900 px-4 md:px-6 lg:px-20 xl:px-30 py-12 md:py-16 lg:py-40 flex-1">
          <div className="mx-auto mt-20 lg:mt-0">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-11 bg-yellow-500" />
                <span className="text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase text-neutral-400">
                  Contact us
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-zinc-300">
                Have questions?
                <br />
                <span>Get in touch!</span>
              </h2>
            </div>

            <AnimatePresence initial={false} mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-3"
                      noValidate
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field, fieldState }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="sr-only">
                                First name
                              </FormLabel>
                              <FormControl>
                                <UnderlinedFieldWrapper
                                  icon={<User className="w-4 h-4" />}
                                  error={!!fieldState.error}
                                >
                                  <Input
                                    {...field}
                                    placeholder="First name *"
                                    autoComplete="given-name"
                                    className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                                  />
                                </UnderlinedFieldWrapper>
                              </FormControl>
                              <div className="min-h-[1.1rem] flex items-start">
                                <FormMessage className="text-red-400 text-[11px] leading-snug" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field, fieldState }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="sr-only">
                                Last name
                              </FormLabel>
                              <FormControl>
                                <UnderlinedFieldWrapper
                                  error={!!fieldState.error}
                                >
                                  <Input
                                    {...field}
                                    placeholder="Last name *"
                                    autoComplete="family-name"
                                    className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                                  />
                                </UnderlinedFieldWrapper>
                              </FormControl>
                              <div className="min-h-[1.1rem] flex items-start">
                                <FormMessage className="text-red-400 text-[11px] leading-snug" />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field, fieldState }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="sr-only">Email</FormLabel>
                              <FormControl>
                                <UnderlinedFieldWrapper
                                  icon={<Mail className="w-4 h-4" />}
                                  error={!!fieldState.error}
                                >
                                  <Input
                                    {...field}
                                    type="email"
                                    placeholder="Email *"
                                    autoComplete="email"
                                    className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                                  />
                                </UnderlinedFieldWrapper>
                              </FormControl>
                              <div className="min-h-[1.1rem] flex items-start">
                                <FormMessage className="text-red-400 text-[11px] leading-snug" />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field, fieldState }) => (
                            <FormItem className="space-y-0">
                              <FormLabel className="sr-only">Phone</FormLabel>
                              <FormControl>
                                <UnderlinedFieldWrapper
                                  icon={<Phone className="w-4 h-4" />}
                                  error={!!fieldState.error}
                                >
                                  <Input
                                    {...field}
                                    type="tel"
                                    placeholder="Phone *"
                                    autoComplete="tel"
                                    className="h-10 w-full bg-transparent border-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                                  />
                                </UnderlinedFieldWrapper>
                              </FormControl>
                              <div className="min-h-[1.1rem] flex items-start">
                                <FormMessage className="text-red-400 text-[11px] leading-snug" />
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Message */}
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field, fieldState }) => (
                          <FormItem className="space-y-0">
                            <FormLabel className="sr-only">Message</FormLabel>
                            <FormControl>
                              <UnderlinedFieldWrapper
                                error={!!fieldState.error}
                              >
                                <textarea
                                  {...field}
                                  placeholder="Your message *"
                                  rows={3}
                                  className="bg-transparent border-none rounded-none px-0 pt-2 text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none resize-none w-full"
                                  style={{
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                  }}
                                />
                              </UnderlinedFieldWrapper>
                            </FormControl>
                            <div className="flex items-start">
                              <FormMessage className="text-red-400 text-[11px] leading-snug" />
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="pt-1">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="group relative select-none w-fit h-11 md:h-12 bg-[#ff9D4D] hover:bg-[#ff9D4D] rounded-none px-10 py-7"
                        >
                          <span className="relative flex items-center justify-center gap-2 text-[11px] md:text-xs">
                            <Send className="w-4 h-4" />
                            {isSubmitting ? "Sending..." : "Send message"}
                          </span>
                        </Button>
                      </div>
                    </form>
                  </Form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center  select-nonejustify-center py-10 text-center"
                >
                  <div className="mb-4 flex items-center justify-center">
                    <div className="h-14 w-14 bg-[#ff9D4D] flex items-center justify-center shadow-2xl">
                      <Send className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    Message sent successfully!
                  </h3>
                  <p className="text-[11px] md:text-sm text-neutral-300 max-w-md mx-auto">
                    Thank you for reaching out. We will contact you as soon as
                    possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-5 px-5 py-2 rounded-none border select-none border-neutral-700 text-[11px] md:text-sm text-neutral-100 transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
