import { Button } from "@headlessui/react";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Separator } from "./separator";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/router";
import { RouteDto } from "@/types/SearchResult";

interface RouteCardProps {
  routeThere: RouteDto;
  routeBack?: RouteDto;
  passengers: number;
  isAuthenticated: boolean;
}

function getMonthName(monthIndex: any) {
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  return months[monthIndex];
}

export default function RouteCard(props: RouteCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { routeThere, routeBack, passengers, isAuthenticated } = props;
  const { addToCart } = useCartStore();

  const handleButtonClick = async () => {
    if (!isAuthenticated) {
      toast.error("Необходимо авторизоваться для бронирования");
      router.push(`/auth/signin`);
      return;
    }

    setIsLoading(true);
    try {
      await addToCart(routeThere, passengers);
      if (routeBack) await addToCart(routeBack, passengers);
      toast.success("Маршрут добавлен в бронирование");
      router.push(`/booking-page`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const departureDateOneWay = new Date(routeThere.flights[0].departure);
  const formattedDepartureDateOneWay = `${departureDateOneWay.getDate()} ${getMonthName(departureDateOneWay.getMonth())}`;
  const departureTimeOneWay = departureDateOneWay
    .toTimeString()
    .substring(0, 5);

  const arrivalDateOneWay = new Date(
    routeThere.flights[routeThere.flights.length - 1].arrival,
  );
  const formattedArrivalDateOneWay = `${arrivalDateOneWay.getDate()} ${getMonthName(arrivalDateOneWay.getMonth())}`;
  const arrivalTimeOneWay = arrivalDateOneWay.toTimeString().substring(0, 5);

  let departureDateReturn;
  let formattedDepartureDateReturn;
  let departureTimeReturn;

  let arrivalDateReturn;
  let formattedArrivalDateReturn;
  let arrivalTimeReturn;

  if (routeBack) {
    departureDateReturn = new Date(routeBack.flights[0].departure);
    formattedDepartureDateReturn = `${departureDateReturn.getDate()} ${getMonthName(departureDateReturn.getMonth())}`;
    departureTimeReturn = departureDateReturn.toTimeString().substring(0, 5);

    arrivalDateReturn = new Date(
      routeBack.flights[routeBack.flights.length - 1].arrival,
    );
    formattedArrivalDateReturn = `${arrivalDateReturn.getDate()} ${getMonthName(arrivalDateReturn.getMonth())}`;
    arrivalTimeReturn = arrivalDateReturn.toTimeString().substring(0, 5);
  }

  return (
    <div className="bg-white rounded-xl shadow-[rgba(0,0,0,0.15)_0px_4px_8px]">
      <div className="hidden md:flex flex-row justify-between gap-6 px-6 py-5">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row gap-3">
            {routeThere.airlines.map((airline, index) => (
              <h2
                key={index}
                className="font-bold text-base font-inter text-blue-500"
              >{`«${airline}»`}</h2>
            ))}
          </div>

          <div className="w-[404px]">
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-sm text-gray-500 font-inter">
                  {formattedDepartureDateOneWay}
                </p>
                <p className="text-2xl font-inter">{departureTimeOneWay}</p>
              </div>
              <div className="flex items-end">
                <p className="text-xs">В пути {routeThere.durationString}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500 font-inter">
                  {formattedArrivalDateOneWay}
                </p>
                <p className="text-2xl font-inter">{arrivalTimeOneWay}</p>
              </div>
            </div>

            <div className="flex flex-col items-center mt-1">
              <div className="flex items-center w-full relative">
                <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                <div className="h-[2px] bg-blue-500 flex-grow"></div>
                {routeThere.layovers.map((layover, index) => (
                  <div key={index} className="flex items-center relative">
                    <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                    <div className="h-[2px] bg-gray-300 w-[30px] mx-1 rounded-full"></div>
                    <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                    {index < routeThere.layovers.length - 1 && (
                      <div className="h-[2px] bg-blue-500 w-[30px]"></div>
                    )}
                    <div className="absolute top-4 text-center text-gray-400 text-xs font-inter">
                      <p style={{ whiteSpace: "nowrap" }}>
                        {layover.airport.name}
                      </p>
                      <p style={{ whiteSpace: "nowrap" }}>
                        {layover.durationString}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="h-[2px] bg-blue-500 flex-grow"></div>
                <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
              </div>
            </div>

            <div className="flex flex-row justify-between">
              <p className="text-sm font-inter">
                {routeThere.flights[0].from.name}
              </p>
              <p className="text-sm font-inter">
                {routeThere.flights[routeThere.flights.length - 1].to.name}
              </p>
            </div>
            <div></div>
          </div>
          {routeBack && (
            <div className="pt-3">
              <Separator />
              {routeBack.airlines.map((airline, index) => (
                <h2
                  key={index}
                  className="font-bold text-base text-blue-500 pt-3"
                >{`«${airline}»`}</h2>
              ))}
              <div className="w-[404px]">
                <div className="flex justify-between">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-inter">
                      {formattedDepartureDateReturn}
                    </p>
                    <p className="text-2xl font-inter">{departureTimeReturn}</p>
                  </div>
                  <div className="flex items-end">
                    <p className="text-xs font-inter">
                      В пути {routeBack.durationString}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500 font-inter">
                      {formattedArrivalDateReturn}
                    </p>
                    <p className="text-2xl font-inter">{arrivalTimeReturn}</p>
                  </div>
                </div>

                <div className="flex flex-col items-center mt-1">
                  <div className="flex items-center w-full relative">
                    <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                    <div className="h-[2px] bg-blue-500 flex-grow"></div>

                    {routeBack.layovers.map((layover, index) => (
                      <div key={index} className="flex items-center relative">
                        <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                        <div className="h-[2px] bg-gray-300 w-[30px] mx-1 rounded-full"></div>
                        <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                        {index < routeBack.layovers.length - 1 && (
                          <div className="h-[2px] bg-blue-500 w-[30px]"></div>
                        )}
                        <div className="absolute top-4 text-center text-gray-400 text-xs font-inter">
                          <p style={{ whiteSpace: "nowrap" }}>
                            {layover.airport.name}
                          </p>
                          <p style={{ whiteSpace: "nowrap" }}>
                            {layover.durationString}
                          </p>{" "}
                          font-inter
                        </div>
                      </div>
                    ))}

                    <div className="h-[2px] bg-blue-500 flex-grow"></div>
                    <div className="w-[10px] h-[10px] bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <p className="text-sm font-inter">
                    {routeBack.flights[0].from.name}
                  </p>
                  <p className="text-sm font-inter">
                    {routeBack.flights[routeThere.flights.length - 1].to.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 self-end">
          <p className="text-3xl text-green-500 font-bold font-roboto">
            {routeBack
              ? (routeThere.totalPrice + routeBack.totalPrice).toLocaleString()
              : routeThere.totalPrice.toLocaleString()}{" "}
            ₽
          </p>
          <Button
            onClick={handleButtonClick}
            disabled={isLoading}
            className="rounded-lg bg-sky-600 py-2 px-4 text-m font-semibold font-inter text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
          >
            Выбрать
          </Button>
        </div>
      </div>

      <div className="md:hidden p-4">
        <div className="mb-4">
          <div className="flex flex-col">
            <div className="flex flex-row gap-3 mb-2">
              {routeThere.airlines.map((airline, index) => (
                <h2 key={index} className="font-bold text-base text-blue-500">
                  {`«${airline}»`}
                </h2>
              ))}
            </div>

            <p className="text-sm text-gray-500 mb-3">
              В пути {routeThere.durationString}
            </p>

            <div className="flex flex-col">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
                  <div className="w-0.5 h-5 bg-blue-500"></div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <p className="font-medium">{departureTimeOneWay}</p>
                  <p className="text-sm text-gray-500">
                    {formattedDepartureDateOneWay}
                  </p>
                  <p className="text-sm">{routeThere.flights[0].from.name}</p>
                </div>
              </div>

              {routeThere.layovers.map((layover, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-4 bg-gray-300 rounded-full"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    {index < routeThere.layovers.length - 1 && (
                      <div className="w-0.5 h-4 bg-blue-500"></div>
                    )}
                  </div>
                  <div className="flex flex-row gap-3 pt-3">
                    <p className="text-sm text-gray-500">
                      {layover.durationString}
                    </p>
                    <p className="text-sm">{layover.airport.name}</p>
                  </div>
                </div>
              ))}

              <div className="flex items-end gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-0.5 h-5 bg-blue-500"></div>
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                </div>
                <div className="flex flex-row items-center gap-3">
                  <p className="font-medium">{arrivalTimeOneWay}</p>
                  <p className="text-sm text-gray-500">
                    {formattedArrivalDateOneWay}
                  </p>
                  <p className="text-sm">
                    {routeThere.flights[routeThere.flights.length - 1].to.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {routeBack && (
          <div className="mb-4 pt-4 border-t">
            <div className="flex flex-col">
              <div className="flex flex-row gap-3 mb-2">
                {routeBack.airlines.map((airline, index) => (
                  <h2 key={index} className="font-bold text-base text-blue-500">
                    {`«${airline}»`}
                  </h2>
                ))}
              </div>

              <p className="text-sm text-gray-500 mb-3">
                В пути {routeBack.durationString}
              </p>

              <div className="flex flex-col">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mt-1"></div>
                    <div className="w-0.5 h-5 bg-blue-500"></div>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <p className="font-medium">{departureTimeReturn}</p>
                    <p className="text-sm text-gray-500">
                      {formattedDepartureDateReturn}
                    </p>
                    <p className="text-sm">{routeBack.flights[0].from.name}</p>
                  </div>
                </div>

                {routeBack.layovers.map((layover, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="w-0.5 h-4 bg-gray-300 rounded-full"></div>
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      {index < routeBack.layovers.length - 1 && (
                        <div className="w-0.5 h-4 bg-blue-500"></div>
                      )}
                    </div>
                    <div className="flex flex-row gap-3 pt-3">
                      <p className="text-sm text-gray-500">
                        {layover.durationString}
                      </p>
                      <p className="text-sm">{layover.airport.name}</p>
                    </div>
                  </div>
                ))}

                <div className="flex items-end gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-5 bg-blue-500"></div>
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <p className="font-medium">{arrivalTimeReturn}</p>
                    <p className="text-sm text-gray-500">
                      {formattedArrivalDateReturn}
                    </p>
                    <p className="text-sm">
                      {routeBack.flights[routeBack.flights.length - 1].to.name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={handleButtonClick}
            disabled={isLoading}
            className="rounded-lg bg-sky-600 py-2 px-4 text-m font-semibold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
          >
            Выбрать
          </Button>
          <p className="text-2xl text-green-500 font-bold">
            {routeBack
              ? (routeThere.totalPrice + routeBack.totalPrice).toLocaleString()
              : routeThere.totalPrice.toLocaleString()}{" "}
            ₽
          </p>
        </div>
      </div>
    </div>
  );
}
