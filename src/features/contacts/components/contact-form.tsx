"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Map from "@/src/features/contacts/components/Map";
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
import { Send } from "lucide-react";
import { contactSchema, ContactSchema } from "../schemas/contact-schema";

const inputClassName =
  "h-10 w-full bg-transparent border rounded-md border-zinc-700 px-3 py-2 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-2 focus-visible:ring-[#ff9D4D] focus-visible:ring-offset-0 focus-visible:border-transparent";
const textareaClassName =
  "min-h-24 w-full bg-transparent border rounded-md border-zinc-700 px-3 py-2 text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-2 focus-visible:ring-[#ff9D4D] focus-visible:ring-offset-0 focus-visible:border-transparent resize-none";

export default function ContactMapSection() {
  const form = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onBlur",
  });

  function onSubmit(values: ContactSchema) {
    console.log("Contact form submitted:", values);
    form.reset();
  }

  function onInvalid(errors: unknown) {
    console.log("Validation errors:", errors);
  }

  return (
    <section className="relative text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/5 right-1/5 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
      </div>
      <div className="relative flex flex-col lg:flex-row h-auto w-full">
        <div className="w-full lg:w-1/2 bg-zinc-900 shrink-0 h-80 lg:h-auto relative border-none">
          <Map />
        </div>
        <div className="bg-zinc-900 px-4 md:px-6 lg:px-20 xl:px-30 py-12 md:py-16 lg:py-40 flex-1">
          <div className="mx-auto mt-20 lg:mt-0">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-11 bg-yellow-500" />
                <span className="text-[11px] md:text-xs font-semibold tracking-[0.28em] uppercase text-neutral-400">
                  იურიდიული კონსულტაცია
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-zinc-300">
                გაქვთ სამართლებრივი შეკითხვა
                <br />
                <span>ან მოუსი? — დაგვიკავშირდით!</span>
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                className="space-y-5"
                noValidate
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-400">სახელი</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="სახელი *"
                            autoComplete="given-name"
                            className={inputClassName}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-400">გვარი</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="გვარი *"
                            autoComplete="family-name"
                            className={inputClassName}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-400">ელფოსტა</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="ელფოსტა *"
                            autoComplete="email"
                            className={inputClassName}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-400">ტელეფონი</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="ტელეფონი *"
                            autoComplete="tel"
                            className={inputClassName}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400 text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-400">შეტყობინება</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="თქვენი შეტყობინება *"
                          rows={4}
                          className={textareaClassName}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400 text-xs" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-fit h-11 md:h-12 bg-[#ff9D4D] hover:bg-[#ea9753] rounded-md px-10"
                >
                  <span className="flex items-center justify-center gap-2 text-[11px] md:text-xs">
                    <Send className="w-4 h-4" />
                    შეტყობინების გაგზავნა
                  </span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
