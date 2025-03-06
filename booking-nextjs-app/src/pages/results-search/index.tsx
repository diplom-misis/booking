import { Button, Checkbox, Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Field, Input, Label } from "@headlessui/react";
import { Layout } from "../layout";
import { useState } from "react";
import { cn } from "@/utils/cn";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import Filters from "@/components/filters";
import { Arrow } from "@/components/arrow";

export default function ResultsSearch() {
  const transfers = [
    { station: 'Белогорье', duration: '2 часа' },
    { station: 'Белогорье', duration: '2 часа' },
  ];

  return (
    <Layout>
      <div className='flex flex-col justify-self-center gap-6'>
        <div className="flex flex-row gap-6">
          <h1 className='text-3xl font-bold'>Результаты поиска</h1>
          <div className="flex flex-row gap-6 pt-3 items-center">
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-row gap-1 items-center">
                <p className="text-sm text-gray-500">Лукоморье</p>
                <p className="text-base text-gray-400">LKMR</p>
              </div>
              <Arrow className='rotate-180 w-5 h-2.5 [&>path]:stroke-gray-500' />
              <div className="flex flex-row gap-1 items-center">
                <p className="text-sm text-gray-500">Тридевятье</p>
                <p className="text-base text-gray-400">TN</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">1 пассажир</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">3 декабря 2024</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">В одну сторону</p>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <Filters />
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <div className="flex flex-row gap-3 items-center border py-1 px-3 rounded-[20px] border-blue-500">
                <p className="text-blue-500 text-xs">Без пересадок</p>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-row gap-3 items-center border py-1 px-3 rounded-[20px] border-blue-500">
                <p className="text-blue-500 text-xs">1 пересадка</p>
                <button>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-blue-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-[rgba(0,0,0,0.15)_0px_4px_8px] flex flex-col gap-3 px-6 py-5 w-[582px]">
              <h2 className="font-bold text-base text-blue-500">«Золотая стрела»</h2>
              <div className="flex flex-row gap-6">
      {/* Время и дата сверху */}
      <div className="w-[404px]">
      <div className="flex justify-between">
        <div className="text-center">
          <p className="text-sm text-gray-500">3 декабря</p>
          <p className="text-2xl">08:00</p>
        </div>
        <div className="flex items-end">
          <p className="text-xs">В пути 4 ч. 30 мин.</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500">3 декабря</p>
          <p className="text-2xl">14:30</p>
        </div>
      </div>

      {/* Линия маршрута */}
      <div className="flex flex-col items-center mt-1">
        <div className="flex items-center w-full relative">
          {/* Начальная точка */}
          <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
          <div className="h-[2px] bg-blue-500 flex-grow"></div>
          {transfers.map((transfer, index) => (
            <div key={index} className="flex items-center relative">
              <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
              <div className="h-[2px] bg-gray-300 w-5 mx-1 rounded-full"></div> {/* Серая линия пересадки */}
              <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
              <div className="h-[2px] bg-blue-500 w-6 flex-grow"></div> {/* Синяя линия между пересадками */}
              <div className="absolute top-4 text-center text-gray-400 text-xs">
                <p>{transfer.station}</p>
                <p>{transfer.duration}</p>
              </div>
            </div>
          ))}
          <div className="h-[2px] bg-blue-500 flex-grow"></div>
          {/* Конечная точка */}
          <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <p className="text-sm">Лукоморье</p>
        <p className="text-sm">Тридевятье</p>
      </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-3xl text-green-500 font-bold">2 500 ₽</p>
        <Button className="rounded-lg bg-sky-600 py-2 px-4 text-m font-semibold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
              Выбрать
            </Button>
      </div>
      </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}