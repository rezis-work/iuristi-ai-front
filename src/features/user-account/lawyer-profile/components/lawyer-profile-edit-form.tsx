"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import {
  upsertProfileSchema,
  lawyerFieldEnum,
  lawyerFieldDisplayNames,
  normalizeProfileFields,
  type UpsertProfileInput,
  type LawyerField,
} from "../schemas/lawyer-schema";
import { useUpdateLawyerProfile } from "../hook/lawyer.-profile";
import type { LawyerProfileResponce } from "../api/layer-profile";
import { Loader2 } from "lucide-react";

interface LawyerProfileEditFormProps {
  profile: LawyerProfileResponce | undefined;
  orgId: string;
  isRefetching?: boolean;
  onSuccess?: () => void;
}

export function LawyerProfileEditForm({
  profile,
  orgId,
  isRefetching,
  onSuccess,
}: LawyerProfileEditFormProps) {
  const updateMutation = useUpdateLawyerProfile(orgId);

  const form = useForm<UpsertProfileInput>({
    resolver: zodResolver(upsertProfileSchema),
    defaultValues: { fields: [] },
    values: profile
      ? { fields: normalizeProfileFields(profile.fields || []) }
      : { fields: [] },
  });

  function onSubmit(data: UpsertProfileInput) {
    const currentFields = new Set(
      normalizeProfileFields(profile?.fields || []),
    );
    const newFields = new Set(data.fields);
    const hasChanged =
      currentFields.size !== newFields.size ||
      ![...currentFields].every((f) => newFields.has(f));

    if (hasChanged) {
      updateMutation.mutate(data, { onSuccess: () => onSuccess?.() });
    }
  }

  const allFields = lawyerFieldEnum.options as LawyerField[];
  const selectedFields = useWatch({ control: form.control, name: "fields", defaultValue: [] }) ?? [];
  const isDisabled = updateMutation.isPending || isRefetching;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fields"
          render={({ fieldState }) => (
            <FormItem>
              <FormLabel className="text-[15px] font-medium text-neutral-200">
                Practice Areas <span className="text-red-500">*</span>
              </FormLabel>
              <div className="mt-4 space-y-3">
                {allFields.map((field) => {
                  const isChecked = selectedFields.includes(field);
                  const handleToggle = () => {
                    if (isDisabled) return;
                    const current = form.getValues("fields");
                    if (current.includes(field)) {
                      form.setValue(
                        "fields",
                        current.filter((f) => f !== field),
                      );
                    } else if (current.length < 3) {
                      form.setValue("fields", [...current, field]);
                    }
                  };
                  return (
                    <div
                      key={field}
                      className="flex cursor-pointer items-center space-x-3"
                      onClick={handleToggle}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggle();
                        }}
                        disabled={isDisabled}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          isChecked
                            ? "border-[#ff9D4D] bg-[#ff9D4D]"
                            : "border-neutral-600 hover:border-[#ff9D4D]"
                        } disabled:cursor-not-allowed disabled:opacity-50`}
                      >
                        {isChecked && (
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <label
                        className={`flex-1 cursor-pointer text-sm font-medium ${
                          isChecked ? "text-neutral-100" : "text-neutral-400"
                        }`}
                      >
                        {lawyerFieldDisplayNames[field]}
                      </label>
                    </div>
                  );
                })}
              </div>
              {fieldState.error && (
                <FormMessage className="mt-2 text-sm text-red-400">
                  {fieldState.error.message}
                </FormMessage>
              )}
            </FormItem>
          )}
        />

        <p className="text-xs text-neutral-500">
          Select your practice areas (minimum 1, maximum 3)
        </p>

        <Button
          type="submit"
          disabled={isDisabled || form.formState.isSubmitting}
          className="h-11 w-full rounded-xs bg-[#FF9D4D] px-5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:bg-[#FF8D3D] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {updateMutation.isPending || form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </Form>
  );
}
