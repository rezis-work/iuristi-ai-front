import z from "zod";


export const memberRoleEnum = z.enum(["owner", "lawyer", "paralegal", "staff", "client"]).default("staff");


export const createInviteSchema = z.object({
    email: z.string().email("არასწორი ელფოსტის ფორმატი").transform((val) => val.toLowerCase()),
    role: memberRoleEnum,
    expiresInDays: z.number().int().min(1).max(30).optional().default(7),
  });

  export type CreateInviteInput = z.infer<typeof createInviteSchema>;




  export const inviteResponseSchema = z.object({
    inviteId: z.string(),
    email: z.string(),
    role: z.string(),
    expiresAt: z.date(),
    inviteToken: z.string(),
  });
  export type InviteResponse = z.infer<typeof inviteResponseSchema>;