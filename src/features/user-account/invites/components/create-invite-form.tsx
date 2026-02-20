"use client";

import { useState } from "react";
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
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const ROLE_OPTIONS = [
  { value: "lawyer", label: "Lawyer" },
  { value: "paralegal", label: "Paralegal" },
  { value: "staff", label: "Staff" },
  { value: "client", label: "Client" },
];

function buildInviteUrl(token: string): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/invite?token=${encodeURIComponent(token)}`;
}

export function CreateInviteForm({ orgId }: { orgId: string }) {
  const createInvite = useCreateInvite(orgId);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<z.input<typeof createInviteSchema>>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      email: "",
      role: "staff",
      expiresInDays: 7,
    },
  });

  function onSubmit(data: z.input<typeof createInviteSchema>) {
    setGeneratedUrl(null);
    const payload: CreateInviteInput = {
      email: data.email,
      role: data.role ?? "staff",
      expiresInDays: data.expiresInDays ?? 7,
    };
    createInvite.mutate(payload, {
      onSuccess: (result) => {
        if (result?.inviteToken) {
          setGeneratedUrl(buildInviteUrl(result.inviteToken));
        }
        form.reset();
      },
    });
  }

  async function handleCopy() {
    if (!generatedUrl) return;
    try {
      await navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <div className="space-y-4">
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

      {generatedUrl && (
        <div className="rounded-lg border border-[#ff9D4D]/30 bg-zinc-900/60 p-4 space-y-2">
          <p className="text-sm text-neutral-400 font-medium">
            Invite link (share with the invited person):
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={generatedUrl}
              className="bg-zinc-800 border-neutral-700 text-neutral-200 text-sm font-mono"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0 border-neutral-600 hover:bg-zinc-800 cursor-pointer"
            >
              {copied ? (
                <Check className="size-4 text-emerald-400" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
