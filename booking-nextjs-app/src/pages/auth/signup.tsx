import Link from "next/link";
import SignUpForm from "@/components/forms/SignUpForm";
import AuthLayout from "@/components/layouts/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout
      additionalLeftBlock={
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">Уже зарегистрированы?</p>
          <Link href="/auth/signin" className="text-blue-500 font-bold">
            Войти в аккаунт
          </Link>
        </div>
      }
    >
      <h2 className="text-2xl font-bold">Регистрация</h2>
      <SignUpForm />
    </AuthLayout>
  );
}
