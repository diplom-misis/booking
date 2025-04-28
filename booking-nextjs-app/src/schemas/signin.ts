import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Некорректный email"),
  password: z.string().min(8, "Минимум 8 символов"),
});

export type SignInSchema = z.infer<typeof signInSchema>;
