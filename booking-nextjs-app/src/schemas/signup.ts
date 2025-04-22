import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "Имя слишком короткое")
      .max(100, "Имя слишком длинное"),
    lastName: z
      .string()
      .min(2, "Фамилия слишком короткая")
      .max(100, "Фамилия слишком длинная"),
    email: z.string().email("Некорректный email"),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Пароль должен содержать минимум 8 символов, заглавную, строчную, цифру и спецсимвол",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
