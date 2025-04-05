import PrimaryButton from '@/components/PrimaryButton';
import { Layout } from '../layout';
import defaultAvatar from '@/images/default-avatar.svg';
import avatarUpload from '@/images/avatar-upload.svg';
import Image from 'next/image';
import InputField from '@/components/InputField';

export default function ProfilePage() {

  return (
    <Layout>
      <div className='flex flex-col justify-self-center w-full md:w-auto gap-3'>
        <div className='flex items-center gap-2 md:mb-6'>
          <h1 className='text-xl md:text-3xl font-bold'>Профиль</h1>
        </div>
        <div className='flex flex-col gap-6 bg-white px-6 py-[2.5rem] shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg font-sans'>
          <div className='flex justify-between'>
            <button className='relative cursor-pointer'>
              <Image
                src={defaultAvatar}
                width={92}
                height={92}
                className='rounded-full'
                alt='Аватар пользователя'
              />
              <Image
                src={avatarUpload}
                width={40}
                height={40}
                className='absolute bottom-0 right-[-20px] w-[40px] h-[40px] rounded-full'
                alt='Загрузить аватар'
              />
            </button>
            <PrimaryButton className='w-[262px] h-[2.5rem]'>История бронирований</PrimaryButton>
          </div>
          <form className='flex flex-col gap-3'>
            <div className='flex gap-2'>
              <InputField
                label='Имя'
                value='Ярополк'
                width='w-[262px]'
              />
              <InputField
                label='Фамилия'
                value='Иванов'
                width='w-[262px]'
              />
            </div>
            <div className='flex gap-2'>
              <InputField
                label='Email'
                value='ivanov@yandex.ru'
                width='w-[262px]'
              />
              <InputField
                label='Имя аккаунта'
                value='Yaropolk'
                width='w-[262px]'
              />
            </div>
            <div className='flex justify-start mt-2'>
              <PrimaryButton className='w-[262px] h-[2.5rem]'>
                Сохранить изменения
              </PrimaryButton>
            </div>
            </form>
        </div>
      </div>
    </Layout>
  );
}
