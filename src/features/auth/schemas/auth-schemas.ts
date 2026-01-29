import z from "zod";


export const loginSchema = z.object({
email: z.string().email(),
password: z.string().min(8),
}).strict();

export type LoginSchema = z.infer<typeof loginSchema>;



export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).strict();

export type RegisterSchema = z.infer<typeof registerSchema>;