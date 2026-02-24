import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z
    .union([
      z
        .string()
        .min(2, "სახელი უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს")
        .max(80, "სახელი უნდა შეიცავდეს 80 სიმბოლოზე ნაკლებს"),
      z.literal(""),
    ])
    .optional(),
  phone: z
    .union([
      z
        .string()
        .min(5, "ტელეფონის ნომერი უნდა შეიცავდეს მინიმუმ 5 სიმბოლოს")
        .max(30, "ტელეფონის ნომერი უნდა შეიცავდეს 30 სიმბოლოზე ნაკლებს"),
      z.literal(""),
    ])
    .optional(),
  avatarUrl: z.string().url("არასწორი URL").optional(),
  timezone: z
    .string()
    .min(3, "დროის სარტყელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს")
    .max(64, "დროის სარტყელი უნდა შეიცავდეს 64 სიმბოლოზე ნაკლებს")
    .optional(),
  accountType: z.enum(["person", "lawyer", "business_owner"]).optional(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
