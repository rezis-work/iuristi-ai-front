"use client";

import { useForm } from "react-hook-form";
import { createOrgSchema, type CreateOrgSchema } from "../schemas/orgs-schema";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useCreateOrgs } from "../hooks/orgs";
import { Building2, Briefcase, Loader2 } from "lucide-react";

const ORG_TYPES = [
  { value: "law_firm", label: "Law Firm" },
  { value: "business", label: "Business" },
  { value: "individual", label: "Individual" },
] as const;

interface OrgsCreatePageProps {
  onSuccess?: () => void;
  /** Compact mode: hide Card wrapper, for use inside Modal */
  compact?: boolean;
}

export default function OrgsCreatePage({ onSuccess, compact }: OrgsCreatePageProps) {
  const createOrgMutation = useCreateOrgs();

  const form = useForm<CreateOrgSchema>({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: "",
      type: undefined,
    } as { name: string; type: "law_firm" | "business" | "individual" | undefined },
  });

  const handleSubmit = (data: CreateOrgSchema) => {
    createOrgMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
      onError: (err) => console.error("Error:", err),
    });
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-neutral-200 text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-[#ff9D4D]/80" />
                Organization Name
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Smith & Associates"
                  className="h-11 bg-neutral-900/60 border-neutral-700 text-neutral-100 placeholder:text-neutral-500 focus-visible:border-[#ff9D4D] focus-visible:ring-[#ff9D4D]/25 rounded-md"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="text-neutral-200 text-sm font-medium flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#ff9D4D]/80" />
                Type
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger className="h-11 w-full bg-neutral-900/60 border-neutral-700 text-neutral-100 data-placeholder:text-neutral-500 focus:border-[#ff9D4D] focus:ring-[#ff9D4D]/25 rounded-md">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-neutral-900 border-neutral-700">
                  {ORG_TYPES.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-neutral-100 focus:bg-neutral-800 focus:text-[#ff9D4D]"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-sm text-red-400" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={createOrgMutation.isPending}
          className="w-full h-11 bg-[#ff9D4D] hover:bg-[#ea9753] text-white font-semibold rounded-md transition-colors shadow-sm"
        >
          {createOrgMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Organization"
          )}
        </Button>
      </form>
    </Form>
  );

  if (compact) {
    return (
      <div className="space-y-1 pt-1">
        {formContent}
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <Card className="bg-transparent rounded-none md:rounded-md border border-neutral-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-[#ff9D4D]" />
            Create Organization
          </CardTitle>
          <p className="text-sm text-neutral-400 mt-1">
            Add a new organization to manage your workspace
          </p>
        </CardHeader>
        <CardContent>{formContent}</CardContent>
      </Card>
    </div>
  );
}
