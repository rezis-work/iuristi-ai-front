"use client";

import React, { useState } from "react";
import Map from "@/src/components/shared/Map";
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

export default function ContactsPage() {
  const [sent, setSent] = useState(false);
  type FormValues = {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    message: string;
  };

  const form = useForm<FormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Contact form submit:", data);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    form.reset();
  };

  return (
    <main className="bg-black text-white">
      <div className="flex flex-col lg:flex-row h-auto lg:h-screen w-full">
        {/* Map Section - Left (60%) */}
        <div
          className="w-full lg:w-[60%] bg-zinc-900 flex-shrink-0 h-96 lg:h-full"
          style={{ position: "relative" }}
        >
          <Map lat={40.70582497139078} lng={-74.01437792445523} zoom={14} />
        </div>

        {/* Contact Form Section - Right (40%) */}
        <div className="bg-black px-6 md:px-8 lg:px-12 py-12 md:py-16 lg:py-20 overflow-y-auto flex-1">
          <div className="max-w-lg mx-auto">
            <div className="mb-1">
              <div className="flex items-center gap-3">
                <div className="h-0.5 w-12 bg-yellow-500"></div>
                <span className="text-sm font-medium tracking-wider uppercase text-neutral-400">
                  Contact Us
                </span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 mt-6">
              Have questions?
              <br />
              <span className="text-white">Get in touch!</span>
            </h2>

            {sent ? (
              <div className="text-green-400 py-8">Thanks — your message was sent.</div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First name</FormLabel>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Message" {...field} rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-[#ff9D4D] hover:bg-[#ea9753] text-white font-semibold uppercase tracking-wider px-8 py-4 rounded-md transition-colors">
                      GET IN TOUCH
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
