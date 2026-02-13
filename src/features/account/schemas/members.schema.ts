import { z } from "zod";

// Match server memberRoleEnum order: "owner", "lawyer", "paralegal", "staff", "client"
export const memberRoleEnum = z.enum([
  "owner",
  "lawyer",
  "paralegal",
  "staff",
  "client",
]);

// Match server updateMemberRoleSchema
export const updateMemberRoleSchema = z.object({
  role: memberRoleEnum,
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;
export type MemberRole = z.infer<typeof memberRoleEnum>;
