import { Button } from "@headlessui/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TransfersState {
  id: number
  station: string
  duration: string
}

interface RouteState {
  id: number,
  airlines: string[],
  dateOut: string,
  timeOut: string,
  dateIn: string,
  timeIn: string,
  totalTime: string,
  transfers: TransfersState[],
  cityFrom: string,
  cityTo: string,
  totalPrice: string
}

interface RouteCardProps {
  route: RouteState
}

export default function RouteCard(props: RouteCardProps) {
  const { route } = props
  const [isSelected, setIsSelected] = useState(false);

  const handleButtonClick = () => {
    setIsSelected(!isSelected);
    if (!isSelected) {
      toast.success("Маршрут добавлен в бронирование");
    } else {
      toast.error("Маршрут удален из бронирования");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-[rgba(0,0,0,0.15)_0px_4px_8px] flex flex-col gap-3 px-6 py-5">
      {route.airlines.map((airline, index) => (
        <h2 key={index} className="font-bold text-base text-blue-500">{airline}</h2>
      ))}
      <div className="flex flex-row gap-6">
      {/* Время и дата сверху */}
      <div className="w-[404px]">
        <div className="flex justify-between">
          <div className="text-center">
            <p className="text-sm text-gray-500">{route.dateOut}</p>
            <p className="text-2xl">{route.timeOut}</p>
          </div>
          <div className="flex items-end">
            <p className="text-xs">В пути {route.totalTime}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">{route.dateIn}</p>
            <p className="text-2xl">{route.timeIn}</p>
          </div>
        </div>

        {/* Линия маршрута */}
        <div className="flex flex-col items-center mt-1">
          <div className="flex items-center w-full relative">
            {/* Начальная точка */}
            <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
            <div className="h-[2px] bg-blue-500 flex-grow"></div>
            {route.transfers.map((transfer, index) => (
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
          <p className="text-sm">{route.cityFrom}</p>
          <p className="text-sm">{route.cityTo}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-3xl text-green-500 font-bold">{route.totalPrice} ₽</p>
        <Button onClick={handleButtonClick} className="rounded-lg bg-sky-600 py-2 px-4 text-m font-semibold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
          {isSelected ? "Убрать" : "Выбрать"}
        </Button>
      </div>
    </div>
    <ToastContainer position="bottom-right" autoClose={3000} />
  </div>
  )
}