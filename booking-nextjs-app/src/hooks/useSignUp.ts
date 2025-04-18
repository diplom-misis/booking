import { useMutation } from "@tanstack/react-query";
import { SignUpSchema } from "@/schemas/signup";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (data: SignUpSchema) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Ошибка регистрации");

      return result;
    },
  });
};
