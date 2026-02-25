import { z } from "zod";



export const chatSchema = z.object({
    message: z.string().min(1).max(5000),
    conversationId: z.string().uuid().optional(),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })
      )
      .optional()
      .default([]),
    options: z
      .object({
        lawCodes: z.array(z.string()).optional(),
        stream: z.boolean().optional(),
      })
      .optional(),
  });


  export type ChatRequestSchema = z.infer<typeof chatSchema>;