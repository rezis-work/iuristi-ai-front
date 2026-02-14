import { z } from "zod";

export const orgTypeEnum = z.enum(["law_firm", "business", "individual"]);

export const createOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  type: orgTypeEnum,
});

export const patchOrgSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name must be at least 1 character")
    .optional(),
  logoUrl: z.string().url("Invalid URL").optional(),
  logoKey: z.string().optional(),
});

export type CreateOrgSchema = z.infer<typeof createOrgSchema>;
export type PatchOrgSchema = z.infer<typeof patchOrgSchema>;

