import { z } from "zod";

// Notifications schema
export const notificationsSchema = z.object({
  productUpdates: z.boolean().optional(),
  security: z.boolean().optional(),
  caseReminders: z.boolean().optional(),
  agentResults: z.boolean().optional(),
  marketing: z.boolean().optional(),
});

// Settings response schema
export const settingsResponseSchema = z.object({
  notifications: z.record(z.string(), z.boolean()),
  preferences: z.record(z.string(), z.unknown()),
  defaultOrgId: z.string().nullable(),
});

// PATCH settings body schema
export const updateSettingsSchema = z.object({
  notifications: notificationsSchema.optional(),
  defaultOrgId: z.string().uuid().nullable().optional(),
  preferences: z.record(z.string(), z.unknown()).optional(),
});

export type NotificationsInput = z.infer<typeof notificationsSchema>;
export type SettingsResponse = z.infer<typeof settingsResponseSchema>;
export type UpdateSettingsSchema = z.infer<typeof updateSettingsSchema>;
