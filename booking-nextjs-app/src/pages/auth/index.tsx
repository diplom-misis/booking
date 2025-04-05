import InputField from '@/components/InputField';
import { Logo } from '@/components/logo';
import PrimaryButton from '@/components/PrimaryButton';
import Link from 'next/link';

export default function AuthPage() {
  // TODO добавить Roboto шрифт
  return (
    <div>
      <div className='flex flex-col justify-center w-screen h-screen'>
        <div className='flex justify-center gap-[calc(0.5rem+10vw)] xl:gap-[11rem] px-1'>
          <div className='hidden md:flex flex-col gap-10 rounded-lg px-4 py-5 self-center'>
            <div className='flex flex-col gap-4'>
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

          <div className='flex flex-col gap-6 bg-transparent px-6 py-[2.5rem] shadow-none md:bg-white md:shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans'>
            <h2 className='text-2xl font-bold'>Вход в аккаунт</h2>
            <form className='flex flex-col gap-4'>
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
                  <Link href='#' className='text-gray-500 self-end'>
                    Забыли пароль?
                  </Link>
                }
              />
              <PrimaryButton className='mt-2'>Войти</PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
