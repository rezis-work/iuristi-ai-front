import z from "zod";






export const contactSchema = z.object({
    name: z.string().min(2, "ველი აუცილებელია."),
    lastName: z.string().min(2, "ველი აუცილებელია."),
    email: z.string().email("ველი აუცილებელია."),
    phone: z
      .string()
      .min(9, "ველი აუცილებელია.")
      .refine(
        (val) => (val.replace(/\D/g, "").length >= 9),
        "გთხოვთ შეიყვანოთ სწორი ტელეფონის ნომერი"
      ),
    message: z.string().min(10, "შეტყობინება უნდა შეიცავდეს მინიმუმ 10 სიმბოლოს."),
  });
  
  export type ContactSchema = z.infer<typeof contactSchema>;    