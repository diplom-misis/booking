import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpSchema } from "@/schemas/signup";
import InputField from "@/components/InputField";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/hooks/useSignUp";
import PrimaryButton from "../PrimaryButton";

export default function SignUpForm() {
  const router = useRouter();
  const { mutate, isPending, isError, error } = useSignUp();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = (data: SignUpSchema) => {
    mutate(data, {
      onSuccess: () => router.push("/auth/signin"),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <InputField
        label="Имя"
        placeholder="Ярополк"
        width="w-[332px]"
        {...register("firstName")}
        error={errors.firstName}
      />
      <InputField
        label="Фамилия"
        placeholder="Иванов"
        width="w-[332px]"
        {...register("lastName")}
        error={errors.lastName}
      />
      <InputField
        label="Email"
        placeholder="ivanov@yandex.ru"
        width="w-[332px]"
        {...register("email")}
        error={errors.email}
      />
      <InputField
        label="Пароль"
        placeholder="Придумайте пароль"
        width="w-[332px]"
        type="password"
        {...register("password")}
        error={errors.password}
      />

      <InputField
        label="Повторите пароль"
        placeholder="Пароль"
        width="w-[332px]"
        type="password"
        {...register("confirmPassword")}
        error={errors.confirmPassword}
      />

      {isError && (
        <p className="text-red-500 text-sm">
          {(error as Error)?.message || "Произошла ошибка"}
        </p>
      )}

      <PrimaryButton type="submit" className="mt-4" disabled={isPending}>
        {isPending ? "Регистрируем..." : "Зарегистрироваться"}
      </PrimaryButton>
    </form>
  );
}
