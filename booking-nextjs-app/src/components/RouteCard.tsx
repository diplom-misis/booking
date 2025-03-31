import { Button } from "@headlessui/react";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Separator } from "./separator";

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
  totalPrice: number
}

interface RouteCardProps {
  routeThere: RouteState
  routeBack?: RouteState
  passengersCount: number
}

export default function RouteCard(props: RouteCardProps) {
  const { routeThere, routeBack, passengersCount } = props
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
    <div>
      <div className="bg-white rounded-xl shadow-[rgba(0,0,0,0.15)_0px_4px_8px] flex flex-row justify-between px-6 py-5">
        <div className="flex flex-col gap-3">
          {routeThere.airlines.map((airline, index) => (
            <h2 key={index} className="font-bold text-base text-blue-500">{airline}</h2>
          ))}
          {/* Время и дата сверху */}
          <div className="w-[404px]">
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-sm text-gray-500">{routeThere.dateOut}</p>
                <p className="text-2xl">{routeThere.timeOut}</p>
              </div>
              <div className="flex items-end">
                <p className="text-xs">В пути {routeThere.totalTime}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">{routeThere.dateIn}</p>
                <p className="text-2xl">{routeThere.timeIn}</p>
              </div>
            </div>

            {/* Линия маршрута */}
            <div className="flex flex-col items-center mt-1">
              <div className="flex items-center w-full relative">
                {/* Начальная точка */}
                <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                <div className="h-[2px] bg-blue-500 flex-grow"></div>
                {routeThere.transfers.map((transfer, index) => (
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
              <p className="text-sm">{routeThere.cityFrom}</p>
              <p className="text-sm">{routeThere.cityTo}</p>
            </div>
            <div>
            </div>
          </div>
          {routeBack &&
            <div className="pt-3">
              <Separator />
              {routeBack.airlines.map((airline, index) => (
                <h2 key={index} className="font-bold text-base text-blue-500 pt-3">{airline}</h2>
              ))}
              {/* Время и дата сверху */}
              <div className="w-[404px]">
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">{routeBack.dateOut}</p>
                    <p className="text-2xl">{routeBack.timeOut}</p>
                  </div>
                  <div className="flex items-end">
                    <p className="text-xs">В пути {routeBack.totalTime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">{routeBack.dateIn}</p>
                    <p className="text-2xl">{routeBack.timeIn}</p>
                  </div>
                </div>

                {/* Линия маршрута */}
                <div className="flex flex-col items-center mt-1">
                  <div className="flex items-center w-full relative">
                    {/* Начальная точка */}
                    <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                    <div className="h-[2px] bg-blue-500 flex-grow"></div>
                    {routeBack.transfers.map((transfer, index) => (
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
                  <p className="text-sm">{routeBack.cityFrom}</p>
                  <p className="text-sm">{routeBack.cityTo}</p>
                </div>
                <div>
                </div>
              </div>
            </div>
          }
        </div>
        <div className="flex flex-col gap-2 self-end">
          <p className="text-3xl text-green-500 font-bold">{routeBack ? ((routeThere.totalPrice + routeBack.totalPrice) * passengersCount).toLocaleString() : (routeThere.totalPrice * passengersCount).toLocaleString()} ₽</p>
          <Button onClick={handleButtonClick} className="rounded-lg bg-sky-600 py-2 px-4 text-m font-semibold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700">
            {isSelected ? "Убрать" : "Выбрать"}
          </Button>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}