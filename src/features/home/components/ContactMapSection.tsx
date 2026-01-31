"use client";

import React from "react";
import { useState } from "react";
import Map from "@/src/components/shared/Map";
import Wrapper from "@/src/components/shared/wrapper";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Button } from "@/src/components/ui/button";

export default function ContactMapSection() {
  const [sent, setSent] = useState(false);

  type FormValues = {
    name: string;
    email: string;
    message: string;
  };

  const form = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Contact form submitted:", data);
    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className="bg-black text-white">
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full">
        {/* Map Section - Left (50%) */}
        <div
          className="w-full lg:w-[50%] bg-zinc-900 shrink-0 h-96 lg:h-full"
          style={{ position: "relative" }}
        >
          <Map lat={40.70582497139078} lng={-74.01437792445523} zoom={14} />
        </div>

        {/* Contact Form Section - Right (50%) */}
        <div className="bg-black px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20 overflow-y-auto flex-1">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-0.5 w-12 bg-yellow-500"></div>
                <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                  Contact Us
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                Have questions?
                <br />
                Get in touch!
              </h2>
            </div>

            {/* Success Message */}
            {sent ? (
              <div className="bg-green-900/30 border border-green-500/50 text-green-400 p-4 rounded">
                Thanks — your message was sent.
              </div>
            ) : (
              /* Contact Form */
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: "Name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    rules={{ required: "Message is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Your message..."
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full bg-[#ff9D4D] hover:bg-[#ea9753] text-white font-semibold uppercase tracking-wider px-8 py-4 rounded-md"
                    >
                      GET IN TOUCH
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
