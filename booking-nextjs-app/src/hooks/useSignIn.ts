import { SignInSchema } from "@/schemas/signin";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";

export const useSignIn = () => {
  return useMutation({
    mutationFn: async (data: SignInSchema) => {
      const res = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (!res?.ok)
        throw new Error(
          res?.error === "CredentialsSignin"
            ? "Неверный логин или пароль"
            : "Произошла ошибка",
        );

      return res;
    },
  });
};
