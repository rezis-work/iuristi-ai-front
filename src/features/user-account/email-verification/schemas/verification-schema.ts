import { z } from "zod";

export const requestVerificationSchema = z.object({});

export const confirmVerificationSchema = z.object({
  token: z.string().min(10, "Token is required and must be at least 10 characters"),
});

export type RequestVerificationInput = z.infer<typeof requestVerificationSchema>;
export type ConfirmVerificationInput = z.infer<typeof confirmVerificationSchema>;

