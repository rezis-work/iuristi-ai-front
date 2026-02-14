import { z } from "zod";

// Match server memberRoleEnum order: "owner", "lawyer", "paralegal", "staff", "client"
export const memberRoleEnum = z.enum([
  "owner",
  "lawyer",
  "paralegal",
  "staff",
  "client",
]);

// Match server createInviteSchema exactly
// role and expiresInDays use defaultValues in form, not .default(), for zodResolver type compatibility
export const createInviteFormSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.toLowerCase()),
  role: memberRoleEnum,
  expiresInDays: z.number().int().min(1).max(30),
});

// Match server acceptInviteSchema exactly
export const acceptInviteFormSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

// Match server createInviteLinkSchema (same as createInvite)
export const createInviteLinkFormSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.toLowerCase()),
  role: memberRoleEnum,
  expiresInDays: z.number().int().min(1).max(30),
});

export type CreateInviteFormData = z.infer<typeof createInviteFormSchema>;
export type AcceptInviteFormData = z.infer<typeof acceptInviteFormSchema>;
export type CreateInviteLinkFormData = z.infer<typeof createInviteLinkFormSchema>;
export type MemberRole = z.infer<typeof memberRoleEnum>;
