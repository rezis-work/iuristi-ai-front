import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .union([
      z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(80, "Name must be less than 80 characters"),
      z.literal(""),
    ])
    .optional(),
  phone: z
    .union([
      z
        .string()
        .min(5, "Phone must be at least 5 characters")
        .max(30, "Phone must be less than 30 characters"),
      z.literal(""),
    ])
    .optional(),
  avatarUrl: z.string().url("Invalid URL").optional(),
  avatarKey: z.string().optional(),
  language: z.enum(["ka", "en", "ru"]).optional(),
  timezone: z
    .string()
    .min(3, "Timezone must be at least 3 characters")
    .max(64, "Timezone must be less than 64 characters")
    .optional(),
  accountType: z.enum(["person", "lawyer", "business_owner"]).optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
