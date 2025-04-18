import { Logo } from "@/components/logo";
import Link from "next/link";
import SignUpForm from "@/components/forms/SignUpForm";

export default function SignUpPage() {
  // TODO добавить Roboto шрифт
  return (
    <div>
      <div className="flex flex-col justify-center w-screen h-screen">
        <div className="flex justify-center gap-[calc(0.5rem+10vw)] xl:gap-[11rem] px-1">
          {/* Левая часть */}
          <div className="flex flex-col gap-10 rounded-lg px-4 py-5 self-center">
            <div className="flex flex-col gap-4">
              <Logo />
              <div className="flex flex-col">
                <p className="text-2xl">Исследуйте вымышленные города</p>
                <p className="text-2xl">из сказок, бронируя билеты</p>
                <p className="text-2xl">легко и быстро.</p>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-500">Уже зарегистрированы?</p>
              <Link href="/auth/signin" className="text-blue-500 font-bold">
                Войти в аккаунт
              </Link>
            </div>
          </div>

          {/* Форма */}
          <div className="flex flex-col gap-6 bg-white px-6 py-[2.5rem] shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans">
            <h2 className="text-2xl font-bold">Регистрация</h2>
            <SignUpForm />
          </div>
        </div>
      </div>
    </div>
  );
}
