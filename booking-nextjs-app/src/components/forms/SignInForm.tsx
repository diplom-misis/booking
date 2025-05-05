import InputField from "@/components/InputField";
import PrimaryButton from "@/components/PrimaryButton";
import { useSignIn } from "@/hooks/useSignIn";
import { signInSchema, SignInSchema } from "@/schemas/signin";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function SignInForm() {
  const router = useRouter();
  const { mutate, isPending, isError, error } = useSignIn();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInSchema) => {
    mutate(data, {
      onSuccess: () => router.push("/profile"),
    });
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="Email или логин"
        placeholder="ivanov@yandex.ru"
        error={errors.email}
        {...register("email")}
      />
      <InputField
        label="Пароль"
        type="password"
        placeholder="******"
        error={errors.password}
        {...register("password")}
        linkComponent={
          <Link href="#" className="text-gray-500">
            Забыли пароль?
          </Link>
        }
      />
      {isError && (
        <p className="text-red-500 text-sm">
          {(error as Error)?.message || "Произошла ошибка"}
        </p>
      )}
      <PrimaryButton type="submit" className="mt-2" disabled={isPending}>
        {isPending ? "Входим..." : "Войти"}
      </PrimaryButton>
    </form>
  );
}
