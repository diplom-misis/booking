import { Arrow } from '@/components/arrow';
import { Separator } from '@/components/separator';
import { Layout } from '../layout';

export default function BookingPage() {
  return (
    <Layout>
      <div className='flex flex-col justify-self-center'>
        <div className='flex items-center gap-2 mb-6'>
          <Arrow />
          <h1 className='text-3xl font-bold'>Бронирование</h1>
        </div>
        <div className='flex gap-5'>
          <div>
            <div className='flex flex-col gap-3 bg-white px-6 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg'>
              <h2 className='text-2xl font-bold'>Рейс</h2>
              <div className='flex justify-between items-center'>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-2 items-center'>
                    <p>Лукоморье LKMR</p>
                    <Arrow className='rotate-180 w-5 h-2.5' />
                    <p>Тридевятье TN</p>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <p>3 декабря 2024 08:00</p>
                    <Arrow className='rotate-180 w-5 h-2.5' />
                    <p>12:30</p>
                  </div>
                </div>
                <div className='flex flex-col gap-1 mr-32'>
                  <p className='text-gray-400 text-xs'>Авиакомпания</p>
                  <p>«Золотая стрела»</p>
                </div>
              </div>
              <div className='flex'>
                <div className='flex flex-col gap-1 w-[225px]'>
                  <p className='text-gray-400 text-xs'>Пассажиров</p>
                  <p>1 пассажир</p>
                </div>
                <div className='flex flex-col gap-1 w-[225px]'>
                  <p className='text-gray-400 text-xs'>Класс</p>
                  <p>Эконом</p>
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-400 text-xs'>Цена</p>
                  <p>2 500 ₽</p>
                </div>
              </div>
              <Separator />
              <h3 className='font-bold'>Данные пассажира</h3>
              <div className='flex justify-between gap-3'>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-400 text-xs'>Имя</p>
                  <input
                    type='text'
                    className='border border-gray-300 rounded-sm px-3.5 py-2 w-[202px]'
                    placeholder='Ярополк'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-400 text-xs'>Фамилия</p>
                  <input
                    type='text'
                    className='border border-gray-300 rounded-sm px-3.5 py-2 w-[202px]'
                    placeholder='Иванов'
                  />
                </div>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-400 text-xs'>Дата рождения</p>
                  <input
                    type='text'
                    className='border border-gray-300 rounded-sm px-3.5 py-2 w-[202px]'
                    placeholder='04.06.1993'
                  />
                </div>
              </div>
              <div className='flex justify-between gap-3'>
                <div className='flex flex-col gap-1'>
                  <p className='text-gray-400 text-xs'>Паспортные данные</p>
                  <div className='flex gap-[6px]'>
                    <input
                      type='text'
                      className='border border-gray-300 rounded-sm px-[14px] py-2 w-24'
                      placeholder='7341'
                    />
                    <input
                      type='text'
                      className='border border-gray-300 rounded-sm px-[14px] py-2 w-24'
                      placeholder='71 34 30'
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-3 bg-white rounded-lg px-4 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] self-start'>
            <div className='flex justify-between items-end'>
              <p className='text-gray-500 text-xs'>Перелёт:</p>
              <p className='text-sm'>2 500 ₽</p>
            </div>
            <div className='flex justify-between items-end'>
              <p className='text-gray-500 text-xs'>Общая сумма:</p>
              <p className='text-green-500 text-2xl font-bold'>6 000 ₽</p>
            </div>
            <button
              type='submit'
              className='bg-blue-500 text-gray-100 px-16 py-2 rounded-lg'
            >
              Забронировать
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
