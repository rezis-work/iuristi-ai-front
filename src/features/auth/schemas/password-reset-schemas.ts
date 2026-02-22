import { z } from "zod";

// Password schema with validation rules (matching backend requirements)
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must not exceed 72 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Request Password Reset Schema
export const requestPasswordResetSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Confirm Password Reset Schema
export const confirmPasswordResetSchema = z
  .object({
    token: z.string().min(10, "Invalid reset token"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Type exports
export type RequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;
export type ConfirmPasswordResetSchema = z.infer<
  typeof confirmPasswordResetSchema
>;
