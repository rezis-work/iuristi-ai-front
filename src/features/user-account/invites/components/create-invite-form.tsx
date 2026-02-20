"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { createInviteSchema, type CreateInviteInput } from "../schemas/invite-schema";
import { z } from "zod";
import { useCreateInvite } from "../hooks/invite";
import { Loader2 } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "lawyer", label: "Lawyer" },
  { value: "paralegal", label: "Paralegal" },
  { value: "staff", label: "Staff" },
  { value: "client", label: "Client" },
];

export function CreateInviteForm({ orgId }: { orgId: string }) {
  const createInvite = useCreateInvite(orgId);

  const form = useForm<z.input<typeof createInviteSchema>>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
      role: "staff",
      expiresInDays: 7,
    },
  });

  function onSubmit(data: z.input<typeof createInviteSchema>) {
    const payload: CreateInviteInput = {
      email: data.email,
      role: data.role ?? "staff",
      expiresInDays: data.expiresInDays ?? 7,
    };
    createInvite.mutate(payload, {
      onSuccess: () => form.reset(),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="example@mail.com"
                  className="bg-zinc-800/80 border-neutral-700 text-neutral-100 placeholder:text-neutral-500"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger className="bg-zinc-800/80 border-neutral-700 text-neutral-200 cursor-pointer">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-900 border-neutral-700">
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-neutral-200 focus:bg-neutral-800"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiresInDays"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-neutral-200">
                Expiry (days)
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  min={1}
                  max={30}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value ? parseInt(e.target.value, 10) : 7
                    )
                  }
                  className="bg-zinc-800/80 border-neutral-700 text-neutral-100"
                />
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={createInvite.isPending}
          className="bg-[#ff9D4D] hover:bg-[#ffa95d] text-white shadow-lg shadow-[#ff9D4D]/20 transition-all cursor-pointer"
        >
          {createInvite.isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Invite"
          )}
        </Button>
      </form>
    </Form>
  );
}
