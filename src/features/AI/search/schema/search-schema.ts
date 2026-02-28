import z from "zod";

export const searchRequestSchema = z.object({
    query: z.string().min(1, "გთხოვ, შეიყვანე საძიებო სიტყვა"),
  });
  
  export type SearchRequest = z.infer<typeof searchRequestSchema>;