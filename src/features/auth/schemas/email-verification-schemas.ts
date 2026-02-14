import { z } from "zod";

// Request Email Verification Schema (empty - user determined by auth token)
export const requestEmailVerificationSchema = z.object({});

// Confirm Email Verification Schema (token from URL)
export const confirmEmailVerificationSchema = z.object({
  token: z
    .string()
    .min(10, "Token is required and must be at least 10 characters"),
});

// Type exports
export type RequestEmailVerificationSchema = z.infer<
  typeof requestEmailVerificationSchema
>;
export type ConfirmEmailVerificationSchema = z.infer<
  typeof confirmEmailVerificationSchema
>;
