import InputField from "@/components/InputField";
import { Logo } from "@/components/logo";
import Link from "next/link";

export default function AuthPage() {
  // TODO добавить Roboto шрифт
  return (
    <div>
      <div className="flex flex-col justify-center w-screen h-screen">
        <div className="flex justify-center gap-[calc(0.5rem+10vw)] xl:gap-[11rem] px-1">
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
              <p className="text-sm text-gray-500">Уже зарегистрированы?</p>
              <Link href="#" className="text-blue-500 font-bold">
                Войти в аккаунт
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-6 bg-white px-6 py-[2.5rem] shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans">
            <h2 className="text-2xl font-bold">Регистрация</h2>
            <div className="flex flex-col gap-4">
              <InputField
                label="Имя"
                placeholder="Ярополк"
                width="w-[332px]"
              />
              <InputField
                label="Фамилия"
                placeholder="Иванов"
                width="w-[332px]"
              />
              <InputField
                label="Email"
                placeholder="ivanov@yandex.ru"
                width="w-[332px]"
              />
              <InputField
                label="Придумайте пароль"
                type="password"
                placeholder="Пароль"
                width="w-[332px]"
              />
              <InputField
                label="Повторите пароль"
                type="password"
                placeholder="Пароль"
                width="w-[332px]"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-gray-100 px-16 py-2 rounded-lg font-bold"
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
