import InputField from "@/components/InputField";
import { Logo } from "@/components/logo";
import PrimaryButton from "@/components/PrimaryButton";
import { useSignIn } from "@/hooks/useSignIn";
import { signInSchema, SignInSchema } from "@/schemas/signin";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function SignInPage() {
  // TODO добавить Roboto шрифт

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
    <div>
      <div className="flex flex-col justify-center w-screen h-screen">
        <div className="flex justify-center gap-[calc(0.5rem+10vw)] xl:gap-[11rem] px-1">
          <div className="hidden md:flex flex-col gap-10 rounded-lg px-4 py-5 self-center">
            <div className="flex flex-col gap-4">
              <Logo />
              <div className="flex flex-col">
                <p className="text-2xl">Исследуйте вымышленные города</p>
                <p className="text-2xl">из сказок, бронируя билеты</p>
                <p className="text-2xl">легко и быстро.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">У вас ещё нет аккаунта?</p>
              <Link href="/auth/signup" className="text-blue-500 font-bold">
                Зарегистрироваться
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 bg-transparent px-6 py-[2.5rem] shadow-none md:bg-white md:shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans">
            <h2 className="text-2xl font-bold">Вход в аккаунт</h2>
            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <InputField
                label="Email или логин"
                placeholder="ivanov@yandex.ru"
                width="w-[332px]"
                error={errors.email}
                {...register("email")}
              />
              <InputField
                label="Пароль"
                type="password"
                placeholder="******"
                width="w-[332px]"
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
              <PrimaryButton
                type="submit"
                className="mt-2"
                disabled={isPending}
              >
                {isPending ? "Входим..." : "Войти"}
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
