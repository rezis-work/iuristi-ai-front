"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateInviteLink } from "../hooks/use-invites";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/src/components/ui/dropdown-menu";
import { Copy, Check, User } from "lucide-react";
import {
  createInviteLinkFormSchema,
  type CreateInviteLinkFormData,
} from "../schemas/invites.schemas";
import { UnderlinedFieldWrapper } from "@/src/components/shared/UnderlinedFieldWrapper";

interface InviteLinkGeneratorProps {
  orgId: string | null;
}

export function InviteLinkGenerator({ orgId }: InviteLinkGeneratorProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const createInviteLinkMutation = useCreateInviteLink(orgId);

  const form = useForm<CreateInviteLinkFormData>({
    resolver: zodResolver(createInviteLinkFormSchema),
    defaultValues: {
      email: "",
      role: "lawyer",
      expiresInDays: 7,
    },
  });

  const handleSubmit = async (data: CreateInviteLinkFormData) => {
    createInviteLinkMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const handleCopyUrl = () => {
    if (createInviteLinkMutation.data?.inviteUrl) {
      navigator.clipboard.writeText(createInviteLinkMutation.data.inviteUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                     <UnderlinedFieldWrapper
                                  icon={<User className="w-4 h-4" />}
                                  error={!!fieldState.error}
                                >
                                  <Input
                                    {...field}
                                     type="email"
                  placeholder="user@example.com"
                                    autoComplete="given-name"
                                    className="h-10 w-full bg-transparent border-none rounded-none px-0 pr-7 text-xs md:text-sm font-medium text-neutral-100 placeholder:text-neutral-600 focus-visible:ring-0 focus-visible:ring-offset-0 keep-bg"
                                  />
                                </UnderlinedFieldWrapper>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-none border-none bg-[#ff9D4D] px-3 py-2 text-sm text-white cursor-pointer focus:outline-none focus:ring-0"
                        >
                          <span>
                            {field.value
                              ? field.value.charAt(0).toUpperCase() +
                                field.value.slice(1)
                              : "Select role"}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) bg-zinc-950 rounded-none"
                        align="start"
                      >
                        <DropdownMenuItem
                          onSelect={() => {
                            field.onChange("owner");
                          }}
                          className="cursor-pointer text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-[#ff9D4D] rounded-none"
                        >
                          Owner
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            field.onChange("lawyer");
                          }}
                          className="cursor-pointer text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-[#ff9D4D] rounded-none"
                        >
                          Lawyer
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            field.onChange("paralegal");
                          }}
                          className="cursor-pointer text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-[#ff9D4D] rounded-none"
                        >
                          Paralegal
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            field.onChange("staff");
                          }}
                          className="cursor-pointer text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-[#ff9D4D] rounded-none"
                        >
                          Staff
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => {
                            field.onChange("client");
                          }}
                          className="cursor-pointer text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-[#ff9D4D] rounded-none"
                        >
                          Client
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="expiresInDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expires In (Days)</FormLabel>
                  <FormControl>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-none border-none bg-[#ff9D4D] px-3 py-2 text-sm text-white cursor-pointer focus:outline-none focus:ring-0"
                        >
                          <span>
                            {field.value
                              ? `${field.value} Day${
                                  field.value === 1 ? "" : "s"
                                }`
                              : "Select days"}
                          </span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) bg-zinc-950 rounded-none"
                        align="start"
                      >
                        {[1, 3, 7, 14, 30].map((days) => (
                          <DropdownMenuItem
                            key={days}
                            onSelect={() => {
                              field.onChange(days);
                            }}
                            className="cursor-pointer text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-[#ff9D4D] rounded-none"
                          >
                            {days} Day{days === 1 ? "" : "s"}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            disabled={createInviteLinkMutation.isPending}
            className="w-full"
          >
            {createInviteLinkMutation.isPending
              ? "Generating..."
              : "Generate Link"}
          </Button>
        </form>
      </Form>

      {createInviteLinkMutation.data?.inviteUrl && (
        <div className="space-y-3 border-t pt-4">
          <p className="text-sm font-medium">Invite Link (QR-friendly):</p>
          <div className="flex gap-2">
            <Input
              type="text"
              readOnly
              value={createInviteLinkMutation.data.inviteUrl}
              className="text-xs"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyUrl}
              title="Copy to clipboard"
            >
              {copiedUrl ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Expires: {new Date(createInviteLinkMutation.data.expiresAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
}
