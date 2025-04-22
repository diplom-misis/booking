<<<<<<< HEAD
=======
<<<<<<<< HEAD:booking-nextjs-app/src/pages/auth/index.tsx
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
import InputField from '@/components/InputField';
import { Logo } from '@/components/logo';
import PrimaryButton from '@/components/PrimaryButton';
import Link from 'next/link';
<<<<<<< HEAD
=======
========
import InputField from "@/components/InputField";
import { Logo } from "@/components/logo";
import PrimaryButton from "@/components/PrimaryButton";
import Link from "next/link";
>>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56:booking-nextjs-app/src/pages/auth/signin.tsx
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56

export default function AuthPage() {
  // TODO добавить Roboto шрифт
  return (
    <div>
<<<<<<< HEAD
=======
<<<<<<<< HEAD:booking-nextjs-app/src/pages/auth/index.tsx
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
      <div className='flex flex-col justify-center w-screen h-screen'>
        <div className='flex justify-center gap-[calc(0.5rem+10vw)] xl:gap-[11rem] px-1'>
          <div className='hidden md:flex flex-col gap-10 rounded-lg px-4 py-5 self-center'>
            <div className='flex flex-col gap-4'>
<<<<<<< HEAD
=======
========
      <div className="flex flex-col justify-center w-screen h-screen">
        <div className="flex justify-center gap-[calc(0.5rem+10vw)] xl:gap-[11rem] px-1">
          <div className="hidden md:flex flex-col gap-10 rounded-lg px-4 py-5 self-center">
            <div className="flex flex-col gap-4">
>>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56:booking-nextjs-app/src/pages/auth/signin.tsx
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
              <Logo />
              <div className='flex flex-col'>
                <p className='text-2xl'>Исследуйте вымышленные города</p>
                <p className='text-2xl'>из сказок, бронируя билеты</p>
                <p className='text-2xl'>легко и быстро.</p>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <p className='text-sm text-gray-500'>У вас ещё нет аккаунта?</p>
              <Link href='#' className='text-blue-500 font-bold'>
                Зарегистрироваться
              </Link>
            </div>
          </div>

<<<<<<< HEAD
          <div className='flex flex-col gap-6 bg-transparent px-6 py-[2.5rem] shadow-none md:bg-white md:shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans'>
            <h2 className='text-2xl font-bold'>Вход в аккаунт</h2>
            <form className='flex flex-col gap-4'>
=======
<<<<<<<< HEAD:booking-nextjs-app/src/pages/auth/index.tsx
          <div className='flex flex-col gap-6 bg-transparent px-6 py-[2.5rem] shadow-none md:bg-white md:shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans'>
            <h2 className='text-2xl font-bold'>Вход в аккаунт</h2>
            <form className='flex flex-col gap-4'>
========
          <div className="flex flex-col gap-6 bg-transparent px-6 py-[2.5rem] shadow-none md:bg-white md:shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans">
            <h2 className="text-2xl font-bold">Вход в аккаунт</h2>
            <form className="flex flex-col gap-4">
>>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56:booking-nextjs-app/src/pages/auth/signin.tsx
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
              <InputField
                label='Email или логин'
                placeholder='ivanov@yandex.ru'
                width='w-[332px]'
              />
              <InputField
                label='Пароль'
                type='password'
                placeholder='******'
                width='w-[332px]'
                linkComponent={
<<<<<<< HEAD
                  <Link href='#' className='text-gray-500 self-end'>
=======
<<<<<<<< HEAD:booking-nextjs-app/src/pages/auth/index.tsx
                  <Link href='#' className='text-gray-500 self-end'>
========
                  <Link href="#" className="text-gray-500">
>>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56:booking-nextjs-app/src/pages/auth/signin.tsx
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
                    Забыли пароль?
                  </Link>
                }
              />
<<<<<<< HEAD
              <PrimaryButton type='submit' className='mt-2'>Войти</PrimaryButton>
=======
<<<<<<<< HEAD:booking-nextjs-app/src/pages/auth/index.tsx
              <PrimaryButton className='mt-2'>Войти</PrimaryButton>
========
              <PrimaryButton type="submit" className="mt-2">
                Войти
              </PrimaryButton>
>>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56:booking-nextjs-app/src/pages/auth/signin.tsx
>>>>>>> 47537556e7febe9b005b42f30b803c2ba06cab56
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
