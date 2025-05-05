import SignInForm from "@/components/forms/SignInForm";
import AuthLayout from "@/components/layouts/AuthLayout";
import { withoutAuthPage } from "@/utils/withoutAuthPage";
import Link from "next/link";

export default function SignInPage() {
  return (
    <AuthLayout
      additionalBlock={
        <div className="flex flex-col gap-1">
          <p className="text-sm text-gray-500">У вас ещё нет аккаунта?</p>
          <Link href="/auth/signup" className="text-blue-500 font-bold">
            Зарегистрироваться
          </Link>
        </div>
      }
    >
      <h2 className="text-2xl font-bold">Вход в аккаунт</h2>
      <SignInForm />
    </AuthLayout>
  );
}

export const getServerSideProps = withoutAuthPage();
