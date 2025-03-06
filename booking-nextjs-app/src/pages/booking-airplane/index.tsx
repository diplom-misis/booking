import { useState } from 'react';
import { Layout } from '../layout';
import { Field, Label, Button, Checkbox } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import CalendarInput from '@/components/CalendarInput';
import SelectInput from '@/components/SelectInput';

const people = [
  { id: 1, name: 'Durward Reynolds' },
  { id: 2, name: 'Kenton Towne' },
  { id: 3, name: 'Therese Wunsch' },
  { id: 4, name: 'Benedict Kessler' },
  { id: 5, name: 'Katelyn Rohan' },
]

const city = [
  { id: 1, name: 'Moscow' },
  { id: 1, name: 'Tokyo' },
]

const airports = [
  { id: 1, name: 'VKO' },
  { id: 1, name: 'DMO' }
]

const typeClass = [
  { id: 1, name: 'Эконом' },
  { id: 2, name: 'Комфорт' },
  { id: 3, name: 'Бизнес' },
  { id: 4, name: 'Первый' }
]

const classMap: Record<string, string> = {
  'Эконом': 'e',
  'Комфорт': 'c',
  'Бизнес': 'b',
  'Первый': 'f'
};

const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}${month}`;
};

export default function BookingAirplane() {
  const router = useRouter()
  const [enabled, setEnabled] = useState(false)
  const [formValid, setFormValid] = useState(true)

  const [formData, setFormData] = useState({
    fromCity: null,
    fromAirport: null,
    toCity: null,
    toAirport: null,
    passengers: people[0],
    classType: typeClass[0],
    departureDate: undefined,
    returnDate: undefined,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClick = (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = Object.values(formData).every((value) => 
      enabled || (value && typeof value.name === 'string' && value.name.trim() !== '')
    );

    const {
      fromCity,
      fromAirport,
      toCity,
      toAirport,
      departureDate,
      returnDate,
      classType,
      passengers
    } = formData;

    const queryString = [
      fromCity?.name || '',
      fromAirport?.name || '',
      formatDate(departureDate),
      toCity?.name || '',
      toAirport?.name || '',
      enabled ? '' : formatDate(returnDate),
      classMap[classType?.name || 'Эконом'],
      passengers ? '1' : ''
    ].join('');

    router.push(`/results-search?query=${queryString}`);

    // if (isValid) {
    //   setFormValid(true);
    //   router.push('/results-search');
    // } else {
    //   setFormValid(false);
    // }
  };

  return (
    <Layout>
      <div className='flex flex-col justify-self-center'>
        <h1 className='text-2xl font-bold mb-6'>Поиск авиабилетов</h1>
        <div className="bg-white rounded-xl border">
          <form className='px-6 py-8 flex flex-col gap-4'>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-row gap-2'>
                <SelectInput className="h-10 w-[160px]" title='Откуда' data={city} value={formData.fromCity} onChange={(value) => handleChange('fromCity', value)} paddingX='[14px]' paddingY='[8px]' typeCombobox={false} placeholder={'Лукоморье'} required />
                <SelectInput className="h-10 w-[88px]" title='Аэропорт' data={airports} value={formData.toAirport} onChange={(value) => handleChange('toAirport', value)} paddingX='[10px]' paddingY='[10px]' disabled typeCombobox={true} required />
              </div>
              <div className='flex flex-row gap-2'>
                <SelectInput className="h-10 w-[160px]" title='Куда' data={city} value={formData.toCity} onChange={(value) => handleChange('toCity', value)} paddingX='[14px]' paddingY='[8px]' typeCombobox={false} placeholder={'Тридевятье'} required />
                <SelectInput className="h-10 w-[88px]" title='Аэропорт' data={airports} value={formData.fromAirport} onChange={(value) => handleChange('fromAirport', value)} paddingX='[10px]' paddingY='[10px]' disabled={true} typeCombobox={true} required />
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <SelectInput className="h-11 w-[262px]" title='Пассажиры' data={people} value={formData.passengers} onChange={(value) => handleChange('passengers', value)} disabled={false} paddingX='[14px]' paddingY='[10px]' defaultValue={people[0].name} typeCombobox={true} required />
              <SelectInput className="h-11 w-[262px]" title='Класс' data={typeClass} value={formData.classType} onChange={(value) => handleChange('classType', value)} disabled={false} paddingX='[14px]' paddingY='[10px]' defaultValue={typeClass[0].name} typeCombobox={true} required />
            </div>
            <div className='flex flex-row gap-2'>
              <CalendarInput value={formData.departureDate} onChange={(date) => handleChange('departureDate', date)} placeholder={'Выберите дату'} required />
              <div className='flex flex-col gap-1'>
                <CalendarInput value={formData.returnDate} onChange={(date) => handleChange('returnDate', date)} disabled={enabled} placeholder={enabled ? 'Без обратного билета' : 'Выберите дату'} hideCalendarIcon={enabled} required={!enabled} />
                <Field className="flex items-center gap-2">
                  <Checkbox
                    checked={enabled}
                    onChange={() => setEnabled(!enabled)}
                    className="group flex items-center justify-center size-4 rounded-sm border border-blue-500 bg-white"
                  >
                    {enabled && (
                      <div className="absolute  size-[10px] bg-blue-500 rounded-sm"></div>
                    )}
                  </Checkbox>
                  <Label className="text-sm text-gray-800">Обратный билет не нужен</Label>
                </Field>
              </div>
            </div>
            <Button onClick={handleClick} className="w-[262px] rounded bg-blue-500 py-2 px-4 text-m font-semibold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
              Найти
            </Button>
            {!formValid && <div className="text-red-500 mt-2">Заполните все обязательные поля</div>}
          </form>
        </div>
      </div>
    </Layout>
  )
}