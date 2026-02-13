"use client";

import { useForm } from "react-hook-form";
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
  useLawyerProfile,
  useUpsertLawyerProfile,
} from "@/src/features/account/hooks/use-lawyer-profile";
import {
  upsertLawyerProfileSchema,
  type UpsertLawyerProfileInput,
  lawyerFieldDisplayNames,
  type LawyerField,
  lawyerFieldEnum,
} from "@/src/features/account/schemas/lawyer-profile.schema";
import { Briefcase, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

interface LawyerProfileFormProps {
  orgId: string | null;
}

export function LawyerProfileForm({ orgId }: LawyerProfileFormProps) {
  const { data: profile, isLoading: isLoadingProfile } =
    useLawyerProfile(orgId);
  const { mutate: upsertProfile, isPending: isUpdating } =
    useUpsertLawyerProfile(orgId);

  const form = useForm<UpsertLawyerProfileInput>({
    resolver: zodResolver(upsertLawyerProfileSchema),
    defaultValues: {
      fields: [],
    },
    values: profile
      ? {
          fields: (profile.fields || []) as LawyerField[],
        }
      : undefined,
  });

  function onSubmit(data: UpsertLawyerProfileInput) {
    // Check if fields have actually changed
    const currentFields = new Set((profile?.fields as LawyerField[]) || []);
    const newFields = new Set(data.fields);

    const hasChanged =
      currentFields.size !== newFields.size ||
      ![...currentFields].every((field: LawyerField) => newFields.has(field));

    if (hasChanged) {
      upsertProfile(data);
    } else {
      // No changes made
      return;
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff9D4D]" />
      </div>
    );
  }

  const allFields: LawyerField[] = lawyerFieldEnum.options as LawyerField[];
  const selectedFields = form.watch("fields");

  return (
    <div className="space-y-6">
      <Card className="bg-transparent rounded-none md:rounded-sm border-none">
        <CardHeader className="px-0 pb-4">
          <CardTitle className="text-xl sm:text-2xl font-semibold text-neutral-100 flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Lawyer Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Legal Fields Selection */}
              <FormField
                control={form.control}
                name="fields"
                render={({ fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 text-[15px] font-medium">
                      Practice Areas <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="space-y-3 mt-4">
                      {allFields.map((field) => {
                        const isChecked = selectedFields.includes(field);
                        const handleToggle = () => {
                          if (isUpdating) return;
                          const current = form.getValues("fields");
                          if (current.includes(field)) {
                            form.setValue(
                              "fields",
                              current.filter((f) => f !== field),
                            );
                          } else {
                            if (current.length < 3) {
                              form.setValue("fields", [...current, field]);
                            }
                          }
                        };
                        return (
                          <div
                            key={field}
                            className="flex items-center space-x-3 cursor-pointer"
                            onClick={handleToggle}
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggle();
                              }}
                              disabled={isUpdating}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0 ${
                                isChecked
                                  ? "bg-[#ff9D4D] border-[#ff9D4D]"
                                  : "border-neutral-600 hover:border-[#ff9D4D]"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {isChecked && (
                                <svg
                                  className="w-3 h-3 text-white"
                                  fill="none"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                            <label
                              className={`text-sm font-medium cursor-pointer flex-1 ${
                                isChecked
                                  ? "text-neutral-100"
                                  : "text-neutral-400"
                              }`}
                            >
                              {lawyerFieldDisplayNames[field]}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    {fieldState.error && (
                      <FormMessage className="text-sm text-red-400 mt-2">
                        {fieldState.error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* Info Text */}
              <div className="pt-2 text-xs text-neutral-500">
                Select your practice areas (minimum 1, maximum 3)
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isUpdating || form.formState.isSubmitting}
                  className="w-full h-11 lg:h-12 px-5 text-sm bg-[#FF9D4D] text-white rounded-xs hover:bg-[#FF8D3D] transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isUpdating || form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
