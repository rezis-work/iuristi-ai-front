import z from "zod";

export const searchRequestSchema = z.object({
  query: z.string().min(1, "გთხოვ, შეიყვანე საძიებო სიტყვა"),
  lawCode: z.string().optional(),
  chapter: z.string().optional(),
  scoreThreshold: z.number().min(0).max(1),
  topK: z.number().int().positive().min(1).max(100),
});

export type SearchRequest = z.infer<typeof searchRequestSchema>;
