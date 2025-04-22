import { Arrow } from '@/components/arrow';
import { Separator } from '@/components/separator';
import { Layout } from '../layout';
import { months } from '@/utils/constants';
import { SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

const data = {
  fromCity: 'Лукоморье',
  fromAirport: 'LKMR',
  toCity: 'Тридевятье',
  toAirport: 'TN',
  company: 'Золотая стрела',
  fromDatetime: new Date('2025-03-02T14:46:22.449Z'),
  toDatetime: new Date('2025-03-02T15:46:22.449Z'),
  passengerCount: 3,
  price: 6000
};

export default function BookingPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [passportSeries, setPassportSeries] = useState<string>('');
  const [passportNumber, setPassportNumber] = useState<string>('');

  const firstNameError = !/^[a-zа-я-]*$/i.test(firstName);
  const lastNameError = !/^[a-zа-я-]*$/i.test(lastName);
  const passportSeriesError = !/^[0-9]*$/.test(passportSeries);
  const passportNumberError = !/^[0-9]*$/.test(passportNumber);

  const formValid =
    !!firstName &&
    !!lastName &&
    !!birthday &&
    !!passportSeries &&
    !!passportNumber &&
    !(
      firstNameError ||
      lastNameError ||
      passportSeriesError ||
      passportNumberError
    );

  const {
    fromCity,
    fromAirport,
    toCity,
    toAirport,
    company,
    fromDatetime,
    toDatetime,
    passengerCount,
    price
  } = data;

  const dayFrom = fromDatetime.getDate();
  const monthFrom = months[fromDatetime.getMonth() + 1];
  const yearFrom = fromDatetime.getFullYear();
  const hoursFrom = fromDatetime.getHours();
  const minutesFrom = fromDatetime.getMinutes();

  const dateFrom = `${dayFrom} ${monthFrom} ${yearFrom}`;
  const timeFrom = `${hoursFrom}:${minutesFrom}`;

  const dayTo = toDatetime.getDate();
  const monthTo = months[toDatetime.getMonth() + 1];
  const yearTo = toDatetime.getFullYear();
  const hoursTo = toDatetime.getHours();
  const minutesTo = toDatetime.getMinutes();

  const dateTo = `${dayTo} ${monthTo} ${yearTo}`;
  const timeTo = `${hoursTo}:${minutesTo}`;

  let passengerEnding;

  if (passengerCount == 1) {
    passengerEnding = 'пассажир';
  } else if (2 <= passengerCount && passengerCount <= 4) {
    passengerEnding = 'пассажира';
  } else if (5 <= passengerCount && passengerCount <= 9) {
    passengerEnding = 'пассажиров';
  }

  const [currentTab, setCurrentTab] = useState<'flight' | 'passengerData'>(
    'flight'
  );

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    await fetch(`/api/booking-page`, {
      method: 'POST',
      body: JSON.stringify({ "routeId": 'bfdb8a43-6618-45f6-9a2c-60876a2208ad' })
    })

    const query = new URLSearchParams({
      fromCity,
      toCity,
      company,
      dateFrom,
      timeFrom,
      fromAirport,
      toAirport,
      fromDatetime: String(fromDatetime),
      toDatetime: String(toDatetime),
      price: String(price)
    }).toString();

    router.push(`/booking-success-page?${query}`);
  };

  return (
    <Layout>
      <div className='flex flex-col justify-self-center w-full md:w-auto gap-3'>
        <div className='flex items-center gap-2 md:mb-6'>
          <Arrow className='hidden lg:inline' />
          <h1 className='text-xl md:text-3xl font-bold'>Бронирование</h1>
        </div>
        <nav className='inline md:hidden'>
          <ul className='flex gap-3.5 relative after:content-[""] after:h-[1px] after:bg-gray-300 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'>
            <li
              className={`flex relative px-4 text-sm ${
                currentTab === 'flight'
                  ? 'text-blue-500 after:content-[""] after:h-0.5 after:bg-blue-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'
                  : 'text-gray-500'
              }`}
              onClick={() => setCurrentTab('flight')}
            >
              Рейс
            </li>
            <li
              className={`flex relative px-4 text-sm ${
                currentTab === 'passengerData'
                  ? 'text-blue-500 after:content-[""] after:h-0.5 after:bg-blue-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'
                  : 'text-gray-500'
              }`}
              onClick={() => setCurrentTab('passengerData')}
            >
              Данные пассажира
            </li>
          </ul>
        </nav>
        <form
          className='flex flex-col gap-5 lg:flex-row'
          onSubmit={handleSubmit}
        >
          <div
            className={`flex flex-col md:gap-3 bg-white px-6 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg`}
          >
            <div
              className={`flex flex-col md:gap-3 bg-white ${
                currentTab === 'flight' ? 'flex' : 'hidden'
              } md:flex`}
            >
              <h2 className='text-xl md:text-2xl font-bold mb-3 md:mb-0 leading-none'>
                Рейс
              </h2>
              <div className='flex flex-col justify-between items-center md:flex-row gap-3'>
                <div className='flex flex-col gap-2 self-start'>
                  <div className='flex gap-2 items-center text-sm md:text-base'>
                    <p>{`${fromCity} ${fromAirport}`}</p>
                    <Arrow className='rotate-180 w-5 h-2.5' />
                    <p>{`${toCity} ${toAirport}`}</p>
                  </div>
                  <div className='flex gap-2 items-center text-sm md:text-base'>
                    <p>{`${dateFrom} ${timeFrom}`}</p>
                    <Arrow className='rotate-180 w-5 h-2.5' />
                    <p>{dayTo > dayFrom ? `${dateTo} ${timeTo}` : timeTo}</p>
                  </div>
                </div>
                <div className='flex md:flex-col gap-1 md:mr-32 items-center self-stretch md:self-start md:items-start justify-between mb-1.5'>
                  <p className='text-gray-400 text-xs h-4'>Авиакомпания</p>
                  <p className='text-sm md:text-base'>«{company}»</p>
                </div>
              </div>
              <div className='flex flex-col md:flex-row gap-1.5'>
                <div className='flex flex-row gap-1 md:w-[225px] md:flex-col justify-between'>
                  <p className='text-gray-400 text-xs'>Пассажиров</p>
                  <p className='text-sm md:text-base'>{`${passengerCount} ${passengerEnding}`}</p>
                </div>
                <div className='flex flex-row gap-1 md:w-[225px] md:flex-col justify-between'>
                  <p className='text-gray-400 text-xs'>Класс</p>
                  <p className='text-sm md:text-base'>Эконом</p>
                </div>
                <div className='flex flex-row gap-1 md:w-[180px] md:flex-col justify-between'>
                  <p className='text-gray-400 text-xs'>Цена</p>
                  <p className='text-sm md:text-base'>2 500 ₽</p>
                </div>
              </div>
            </div>
            <Separator extraClass='hidden md:flex'/>
            <div
              className={`flex flex-col gap-3 ${
                currentTab === 'passengerData' ? 'flex' : 'hidden'
              } md:flex`}
            >
              {(() => {
                const passengers = [];
                for (let count = 1; count <= passengerCount; count++) {
                  passengers.push(
                    <div key={count}>
                      <div className='flex flex-col gap-3'>
                        <h3 className='font-bold'>Данные пассажира {count}</h3>
                        <div className='flex flex-col md:flex-row gap-3'>
                          <div className='flex flex-col gap-1'>
                            <p className='text-gray-400 text-xs'>Имя</p>
                            <input
                              type='text'
                              className='border border-gray-300 rounded-sm px-3.5 py-2 w-full md:w-[202px] hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base'
                              placeholder='Ярополк'
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              pattern='[A-za-zА-яа-я\-]*$'
                            />
                            {firstNameError && (
                              <p className='text-xs text-red-500 w-full md:max-w-[202px]'>
                                Имя может содержать только буквы и дефис
                              </p>
                            )}
                          </div>
                          <div className='flex flex-col gap-1'>
                            <p className='text-gray-400 text-xs'>Фамилия</p>
                            <input
                              type='text'
                              className='border border-gray-300 rounded-sm px-3.5 py-2 w-full md:w-[202px] hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base'
                              placeholder='Иванов'
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              pattern='[A-za-zА-яа-я\-]*$'
                            />
                            {lastNameError && (
                              <p className='text-xs text-red-500 w-full md:max-w-[202px]'>
                                Фамилия может содержать только буквы и дефис
                              </p>
                            )}
                          </div>
                          <div className='flex flex-col gap-1'>
                            <p className='text-gray-400 text-xs'>
                              Дата рождения
                            </p>
                            <input
                              type='date'
                              className='border border-gray-300 rounded-sm px-3.5 py-2 w-full md:w-[202px] hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base'
                              placeholder='04.06.1993'
                              value={birthday}
                              onChange={(e) => setBirthday(e.target.value)}
                              onFocus={(e) => (e.target.type = 'date')}
                              onBlur={(e) => (e.target.type = 'text')}
                            />
                          </div>
                        </div>
                        <div className='flex justify-between gap-3'>
                          <div className='flex flex-col gap-1'>
                            <p className='text-gray-400 text-xs'>
                              Паспортные данные
                            </p>
                            <div className='flex gap-[6px]'>
                              <div className='flex flex-col gap-1'>
                                <input
                                  type='text'
                                  className='border border-gray-300 rounded-sm px-[14px] py-2 w-full md:w-24 hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base'
                                  placeholder='7341'
                                  value={passportSeries}
                                  onChange={(e) =>
                                    setPassportSeries(e.target.value)
                                  }
                                  maxLength={4}
                                  pattern='\d*'
                                />
                                {passportSeriesError && (
                                  <p className='text-xs text-red-500 max-w-36 md:max-w-24'>
                                    Серия паспорта может содержать только цифры
                                  </p>
                                )}
                              </div>
                              <div className='flex flex-col gap-1'>
                                <input
                                  type='text'
                                  className='border border-gray-300 rounded-sm px-[14px] py-2 w-full md:w-24 hover:border-gray-400 focus:outline-none focus:border-blue-500 h-10 invalid:border-red-500 placeholder:text-sm md:placeholder:text-base'
                                  placeholder='71 34 30'
                                  value={passportNumber}
                                  onChange={(e) =>
                                    setPassportNumber(e.target.value)
                                  }
                                  maxLength={6}
                                  pattern='\d*'
                                />
                                {passportNumberError && (
                                  <p className='text-xs text-red-500 max-w-36 md:max-w-24'>
                                    Номер паспорта может содержать только цифры
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return passengers;
              })()}
            </div>
          </div>
          <div className='flex flex-col gap-3 bg-white md:rounded-lg px-5 md:px-4 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] self-start w-screen md:w-auto ms-[-20px] md:ms-0'>
            <div className='justify-between items-end hidden md:flex'>
              <p className='text-gray-500 text-xs'>Перелёт:</p>
              <p className='text-sm'>2 500 ₽</p>
            </div>
            <div className='flex justify-between items-end'>
              <p className='text-gray-500 text-xs'>Общая сумма:</p>
              <p className='text-green-500 text-2xl font-bold'>{price} ₽</p>
            </div>
            <button
              type='submit'
              className='bg-blue-500 text-gray-100 px-16 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-300 text-sm md:text-base'
              disabled={!formValid}
            >
              Забронировать
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
