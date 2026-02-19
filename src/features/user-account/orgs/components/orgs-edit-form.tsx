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
import { useUpdateOrg } from "../hooks/orgs";
import { useOrgType } from "../lib/orgs-type";
import { Building2, Briefcase, Loader2 } from "lucide-react";

const ORG_TYPES = [
  { value: "law_firm", label: "Law Firm" },
  { value: "business", label: "Business" },
  { value: "individual", label: "Individual" },
] as const;

interface OrgsEditFormProps {
  id: string;
  defaultValues: { name: string; type: "law_firm" | "business" | "individual" };
  onSuccess?: () => void;
}

export default function OrgsEditForm({
  id,
  defaultValues,
  onSuccess,
}: OrgsEditFormProps) {
  const updateOrgMutation = useUpdateOrg();
  const { setType } = useOrgType();

  const form = useForm<CreateOrgSchema>({
    resolver: zodResolver(createOrgSchema),
    defaultValues,
    
  });


  const handleSubmit = (data: CreateOrgSchema) => {
    form.reset();
    updateOrgMutation.mutate(
      { id, data },
      {
        onSuccess: (_result, variables) => {
          setType(variables.data.type);
          onSuccess?.();
        },
        onError: (err) => console.error("Error:", err),
      }
    );
  };

  return (
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
              <Select onValueChange={field.onChange} value={field.value}>
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
          disabled={updateOrgMutation.isPending}
          className="w-full h-11 bg-[#ff9D4D] hover:bg-[#ea9753] text-white font-semibold rounded-md transition-colors shadow-sm"
        >
          {updateOrgMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
