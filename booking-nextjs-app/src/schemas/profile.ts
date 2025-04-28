import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "Имя слишком короткое")
    .max(100, "Имя слишком длинное"),
  lastName: z
    .string()
    .min(2, "Фамилия слишком короткая")
    .max(100, "Фамилия слишком длинная"),
  email: z.string().email("Некорректный email"),
  usernameSchema: z
    .string()
    .min(3, { message: "Имя пользователя должно содержать минимум 3 символа" })
    .max(20, {
      message: "Имя пользователя должно содержать максимум 20 символов",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message:
        "Имя пользователя может содержать только буквы, цифры и подчеркивания",
    })
    .regex(/^[a-zA-Z]/, {
      message: "Имя пользователя должно начинаться с буквы",
    })
    .transform((username) => username.toLowerCase()),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
