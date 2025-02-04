import { Separator } from '@/components/separator';
import { Layout } from '../layout';

export default function BookingSuccessPage() {
  return (
    <Layout>
      <div className='flex flex-col justify-self-center gap-6'>
        <h2 className='text-3xl font-bold text-gray-800'>
          Ваше бронирование подтверждено!
        </h2>
        <div className='flex flex-col gap-4 bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg'>
          <div className='flex justify-between'>
            <p className='text-2xl text-gray-800 font-bold'>#YA12345678</p>
            <p className='text-2xl text-gray-800'>29 ноября 2024</p>
            <p className='text-green-500 text-2xl'>6 000 ₽</p>
          </div>
          <Separator />
          <div className='flex'>
            <p className='text-gray-800 font-bold w-40'>Детали рейса</p>
            <div className='flex flex-col gap-1 w-[200px]'>
              <p className='text-gray-400 text-xs'>Отправление</p>
              <p className='text-gray-800 text-sm'>Лукоморье → Тридевятье</p>
            </div>
            <div className='flex flex-col gap-1 w-[200px]'>
              <p className='text-gray-400 text-xs'>Дата и время</p>
              <p className='text-gray-800 text-sm'>08:00 2 декабря 2024</p>
            </div>
            <div className='flex flex-col gap-1 max-w-[200px]'>
              <p className='text-gray-400 text-xs'>Авиакомпания</p>
              <p className='text-gray-800 text-sm'>«Золотая стрела»</p>
            </div>
          </div>
          <Separator />
          <div className='flex'>
            <p className='text-gray-800 font-bold w-40'>Отель</p>
            <div className='flex flex-col gap-1 w-[200px]'>
              <p className='text-gray-400 text-xs'>Название</p>
              <p className='text-gray-800 text-sm'>«Златая палата»</p>
            </div>
            <div className='flex flex-col gap-1 w-[200px]'>
              <p className='text-gray-400 text-xs'>Заезд</p>
              <p className='text-gray-800 text-sm'>3 декабря 2024</p>
            </div>
            <div className='flex flex-col gap-1 max-w-[200px]'>
              <p className='text-gray-400 text-xs'>Выезд</p>
              <p className='text-gray-800 text-sm'>4 декабря 2024</p>
            </div>
          </div>
          <Separator />
          <div className='flex flex-col gap-0.5'>
            <div className='flex'>
              <p className='text-gray-800 font-bold w-40'>Способы оплаты</p>
              <p className='text-gray-800 text-sm w-[200px]'>
                Банковская карта
              </p>
              <p className='text-gray-800 text-sm w-[200px]'>
                Электронные кошельки
              </p>
              <p className='text-gray-800 text-sm max-w-[200px]'>
                Банковский перевод*
              </p>
            </div>
            <p className='text-gray-400 text-xs'>
              *При оплате переводом укажите номер бронирования в комментарии
              к платежу
            </p>
          </div>
          <Separator />
          <div>
            <p className='text-sm max-w-[700px] text-gray-800'>
              Бесплатная отмена бронирования возможна до 10 декабря 2024, 23:59.
            </p>
            <p className='text-sm max-w-[700px] text-gray-800'>
              После указанного времени удерживается штраф в размере 50%
              от стоимости билета.
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          <button
            type='submit'
            className='bg-blue-500 text-gray-100 px-4 py-2 rounded-lg'
          >
            Оформить заказ
          </button>
          <button
            type='button'
            className='border border-gray-300 px-4 py-2 rounded-lg text-gray-800 font-bold '
          >
            Распечатать
          </button>
        </div>
      </div>
    </Layout>
  );
}
