import { z } from "zod";

// Match server lawyerFieldEnum
export const lawyerFieldEnum = z.enum(["civil", "administrative", "criminal"]);

// Match server upsertProfileSchema
export const upsertLawyerProfileSchema = z.object({
  fields: z
    .array(lawyerFieldEnum)
    .min(1, "At least one field is required")
    .max(3, "Maximum 3 fields allowed")
    .refine(
      (fields) => {
        const unique = new Set(fields);
        return unique.size === fields.length;
      },
      {
        message: "Fields must be unique",
      },
    ),
});

// Match server lawyerProfileResponseSchema
export const lawyerProfileResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  orgId: z.string(),
  fields: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.string().or(z.date()),
  updatedAt: z.string().or(z.date()),
});

export type UpsertLawyerProfileInput = z.infer<
  typeof upsertLawyerProfileSchema
>;
export type LawyerProfileResponse = z.infer<typeof lawyerProfileResponseSchema>;
export type LawyerField = z.infer<typeof lawyerFieldEnum>;

// Display names for fields
export const lawyerFieldDisplayNames: Record<LawyerField, string> = {
  civil: "Civil Law",
  administrative: "Administrative Law",
  criminal: "Criminal Law",
};
