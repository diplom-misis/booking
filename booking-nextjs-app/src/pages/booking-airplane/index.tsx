import { useEffect, useState } from 'react';
import { Layout } from '../layout';
import { Field, Label, Button, Checkbox } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import CalendarInput from '@/components/CalendarInput';
import SelectInput from '@/components/SelectInput';
import { useForm } from "react-hook-form"
import PassengersSelect from '@/components/PassengersSelect';
import { useCities } from '@/hooks/useCities';
import { useCityStore } from '@/store/useCityStore';
import { useAirportStore } from '@/store/useAirportStore';
import { useAirports } from '@/hooks/useAirports';

const typeClass = [
  { id: '1', name: 'Эконом' },
  { id: '2', name: 'Комфорт' },
  { id: '3', name: 'Бизнес' },
  { id: '4', name: 'Первый' }
]

const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

export default function BookingAirplane() {
  const router = useRouter()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  
  const [formData, setFormData] = useState({
    fromCity: null,
    fromAirport: null,
    toCity: null,
    toAirport: null,
    passengers: { Взрослые: 1, Дети: 0, Младенцы: 0 },
    classType: typeClass[0],
    departureDate: undefined,
    returnDate: undefined,
    isOneWay: false,
  });

  useEffect(() => {
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);

      if (parsedData.departureDate) {
        parsedData.departureDate = new Date(parsedData.departureDate);
      }
      if (parsedData.returnDate) {
        parsedData.returnDate = new Date(parsedData.returnDate);
      }

      setFormData(parsedData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  
  const { data: cities } = useCities();
  const { cities: storedCities } = useCityStore();
  const { data: fetchedAirports } = useAirports(formData.fromCity?.id);
  const { airports } = useAirportStore();
  const { data: fetchedToAirports } = useAirports(formData.toCity?.id);

  useEffect(() => {
    if (fetchedAirports?.length) {
      setValue('fromAirport', fetchedAirports[0]);
    }
  }, [fetchedAirports, setValue]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValue(field, value);
  };

  const handleCheckboxChange = () => {
    const newEnabledState = !formData.isOneWay;
    setFormData((prev) => ({
      ...prev,
      isOneWay: newEnabledState,
      returnDate: newEnabledState ? undefined : prev.returnDate,
    }));
  }

  const handleClick = (data: any) => {
    const {
      fromCity,
      fromAirport,
      toCity,
      toAirport,
      departureDate,
      returnDate,
      classType,
      passengers,
      isOneWay
    } = formData;

    const totalPassengers = Object.values(passengers).reduce((acc, count) => acc + count, 0);

    const queryString = new URLSearchParams({
      cityFrom: fromCity?.name || '',
      airportFrom: fromAirport?.code || '',
      dateFrom: formatDate(departureDate),
      cityTo: toCity?.name || '',
      airportTo: toAirport?.code || '',
      dateTo: isOneWay ? '' : formatDate(returnDate),
      class: classType?.name || '',
      passengers: totalPassengers.toString()
    }).toString();
    
    router.push(`/results-search?${queryString}`);
  };

  return (
    <Layout>
      <div className='flex flex-col justify-self-center'>
        <h1 className='text-2xl font-bold mb-6'>Поиск авиабилетов</h1>
        <div className="bg-white rounded-xl border">
          <form onSubmit={handleSubmit(handleClick)} className='px-6 py-8 flex flex-col gap-4'>
            <div className='flex flex-row gap-5'>
              <div className='flex flex-row gap-2'>
                <div className='flex flex-col gap-1'>
                  <SelectInput
                    {...register('fromCity', { required: 'Это поле обязательно',  })}
                    className="h-10 w-[160px] px-[14px] py-[8px]"
                    title='Откуда'
                    data={storedCities.filter(city => city.id !== formData.toCity?.id)}
                    value={formData.fromCity}
                    typeCombobox={false}
                    placeholder={'Лукоморье'}
                    onChange={(value) => handleChange('fromCity', value)}
                  />
                  {errors.fromCity && <p className='text-red-500 text-sm'>Это поле обязательное</p>}
                </div>
                <SelectInput className="h-10 w-[88px] px-[10px] py-[10px]" title='Аэропорт' data={fetchedAirports || []} value={formData.toAirport} disabled typeCombobox={true} onChange={(value) => handleChange('toAirport', value)} />
              </div>
              <div className='flex flex-row gap-2'>
                <div className='flex flex-col gap-1'>
                <SelectInput className="h-10 w-[160px] px-[14px] py-[8px]" title='Куда' data={storedCities.filter(city => city.id !== formData.fromCity?.id)} value={formData.toCity} typeCombobox={false} placeholder={'Тридевятье'} {...register('toCity', { required: 'Это поле обязательно' })} onChange={(value) => handleChange('toCity', value)}  />
                {errors.toCity && <p className='text-red-500 text-sm'>Это поле обязательное</p>}
                </div>
                <SelectInput className="h-10 w-[88px] px-[10px] py-[10px]" title='Аэропорт' data={fetchedToAirports || []} value={formData.fromAirport} disabled={true} typeCombobox={true} onChange={(value) => handleChange('fromAirport', value)} />
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <PassengersSelect value={formData.passengers} onChange={(value) => handleChange('passengers', value)} />
              <SelectInput className="h-11 w-[262px] px-[14px] py-[10px]" title='Класс' data={typeClass} value={formData.classType} disabled={false} defaultValue={typeClass[0].name} typeCombobox={true} onChange={(value) => handleChange('classType', value)} />
            </div>
            <div className='flex flex-row gap-2'>
              <div className='flex flex-col gap-1'>
                <CalendarInput {...register('departureDate', { required: 'Это поле обязательно' })} value={formData.departureDate} placeholder={'Выберите дату'} onChange={(date) => handleChange('departureDate', date)} />
                {errors.departureDate && <p className='text-red-500 text-sm'>Это поле обязательное</p>}
              </div>
              <div className='flex flex-col gap-1'>
                <CalendarInput {...register('returnDate', { required: !formData.isOneWay && 'Это поле обязательно' })} value={formData.returnDate} disabled={formData.isOneWay} placeholder={formData.isOneWay ? 'Без обратного билета' : 'Выберите дату'} hideCalendarIcon={formData.isOneWay} onChange={(date) => handleChange('returnDate', date)} />
                {errors.returnDate && <p className='text-red-500 text-sm'>Это поле обязательное</p>}
                <Field className="flex items-center gap-2">
                  <Checkbox
                    checked={formData.isOneWay}
                    onChange={handleCheckboxChange}
                    className="group flex items-center justify-center size-4 rounded-sm border border-blue-500 bg-white"
                  >
                    {formData.isOneWay && (
                      <div className="absolute  size-[10px] bg-blue-500 rounded-sm"></div>
                    )}
                  </Checkbox>
                  <Label className="text-sm text-gray-800">Обратный билет не нужен</Label>
                </Field>
              </div>
            </div>
            <Button type="submit" className="w-[262px] rounded bg-blue-500 py-2 px-4 text-m font-semibold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
              Найти
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  )
}