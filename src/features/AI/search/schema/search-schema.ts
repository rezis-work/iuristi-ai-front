import z from "zod";

export const searchRequestSchema = z.object({
    query: z.string().min(1, "გთხოვ, შეიყვანე საძიებო სიტყვა"),
    scoreThreshold : z.number().min(0).max(1),
    topK : z.number().int().positive().max(1),
  });
  
  export type SearchRequest = z.infer<typeof searchRequestSchema>;