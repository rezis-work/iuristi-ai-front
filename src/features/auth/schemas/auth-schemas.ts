import z from "zod";

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "სახელი უნდა იყოს მინიმუმ 2 სიმბოლო"),
    email: z.string().email("გთხოვ, შეიყვანე სწორი ელფოსტის მისამართი"),
    password: z.string().min(8, "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო"),
    confirmPassword: z
      .string()
      .min(8, "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "პაროლები არ ემთხვევა",
    path: ["confirmPassword"],
  })
  .strict();

export type RegisterSchema = z.infer<typeof registerSchema>;

// auth-schemas.ts

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "მიმდინარე პაროლი სავალდებულოა"),
    newPassword: z.string().min(8, "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო"),
    confirmPassword: z
      .string()
      .min(8, "პაროლი უნდა იყოს მინიმუმ 8 სიმბოლო"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "პაროლები არ ემთხვევა",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "ახალი პაროლი უნდა განსხვავდებოდეს მიმდინარე პაროლისგან",
    path: ["newPassword"],
  });

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
