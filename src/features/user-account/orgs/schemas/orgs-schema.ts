import { z } from "zod";

export const orgTypeEnum = z.enum(["law_firm", "business", "individual"]);

export const createOrgSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  type: orgTypeEnum,
});

export type CreateOrgSchema = z.infer<typeof createOrgSchema>;