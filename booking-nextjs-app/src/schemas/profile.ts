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
  defaultCountry: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
