import { Button } from "@headlessui/react";

type HotelsData = {
  id: string
  name: string
  price: number
  rating: number
}

interface HotelsProps {
  hotels: HotelsData[]
}

export default function HotelsList({ hotels }: HotelsProps) {
  return (
    <div className="bg-white rounded-xl shadow-[rgba(0,0,0,0.15)_0px_4px_8px] max-h-max">
      <div className="flex flex-col gap-6 px-4 py-5">
        <h2 className="font-bold text-base">Отели в Тридевятье</h2>
        <div className="flex flex-col gap-2">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="w-[247px] bg-gray-100 rounded-lg px-4 py-4 flex flex-col gap-2">
              <p className="text-base font-bold">«{hotel.name}»</p>
              <div className="flex flex-col gap-[2px]">
                <div className="flex flex-row justify-between">
                  <p className="text-sm">Цена за ночь</p>
                  <p className="text-green-500 text-sm font-bold">от {hotel.price} ₽</p>
                </div>
                <div className="flex flex-row justify-between">
                  <p className="text-sm">Рейтинг</p>
                  <p className="text-sm font-bold">{hotel.rating}</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button className="w-full border border-gray-300 rounded-lg bg-white py-2 px-4 text-m font-bold text-black">
                  Добавить
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}