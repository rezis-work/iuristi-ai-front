import z from "zod";

export const lawyerFieldEnum = z.enum(["civil", "administrative", "criminal"]);

export const upsertProfileSchema = z.object({
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
      }
    ),
});

export const lawyerProfileResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  orgId: z.string(),
  fields: z.array(z.string()),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UpsertProfileInput = z.infer<typeof upsertProfileSchema>;
export type LawyerProfileResponse = z.infer<typeof lawyerProfileResponseSchema>;
export type LawyerField = z.infer<typeof lawyerFieldEnum>;

export const lawyerFieldDisplayNames: Record<LawyerField, string> = {
  civil: "Civil Law",
  administrative: "Administrative Law",
  criminal: "Criminal Law",
};

/** Reverse map: display name -> key */
const displayNameToKey: Record<string, LawyerField> = {
  "Civil Law": "civil",
  "Administrative Law": "administrative",
  "Criminal Law": "criminal",
};

/** Normalize backend fields (keys or display names) to LawyerField[] */
export function normalizeProfileFields(fields: string[]): LawyerField[] {
  const keys = lawyerFieldEnum.options as LawyerField[];
  return fields
    .map((f) => (keys.includes(f as LawyerField) ? f : displayNameToKey[f]))
    .filter((f): f is LawyerField => !!f && keys.includes(f));
}