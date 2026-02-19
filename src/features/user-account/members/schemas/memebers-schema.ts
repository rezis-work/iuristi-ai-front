import { z } from "zod";
import { memberRoleEnum } from "../../invites/schemas/invite-schema";



export const updateMemberRoleSchema = z.object({
  role: z.enum(["owner", "admin", "member"]),
});

export const memberResponseSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string().nullable(),
  role: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;



export const acceptInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;




export const createInviteLinkSchema = z.object({
  email: z.string().email("Invalid email format").transform((val) => val.toLowerCase()),
  role: memberRoleEnum.default("staff"),
  expiresInDays: z.number().int().min(1).max(30).optional().default(7),
});

export type CreateInviteLinkInput = z.infer<typeof createInviteLinkSchema>;