import { z } from "zod";

// Password schema with validation rules (matching backend requirements)
export const passwordSchema = z
  .string()
  .min(8, "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო")
  .max(72, "პაროლი არ უნდა აღემატებოდეს 72 სიმბოლოს")
  .regex(/[a-zA-Z]/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ასოს")
  .regex(/[0-9]/, "პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს");

// Request Password Reset Schema
export const requestPasswordResetSchema = z.object({
  email: z.string().email("არასწორი ელფოსტის მისამართი"),
});

// Confirm Password Reset Schema
export const confirmPasswordResetSchema = z
  .object({
    token: z.string().min(10, "არასწორი აღდგენის ტოკენი"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "პაროლები არ ემთხვევა",
    path: ["confirmPassword"],
  });

// Type exports
export type RequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;
export type ConfirmPasswordResetSchema = z.infer<
  typeof confirmPasswordResetSchema
>;
