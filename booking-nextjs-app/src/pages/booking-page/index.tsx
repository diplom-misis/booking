import { Arrow } from "@/components/arrow";
import { Separator } from "@/components/separator";
import Layout from "../layout";
import { months } from "@/utils/constants";
import { SyntheticEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PassengerInputs from "@/components/PassengerInputs";
import { useCartStore } from "@/store/cartStore";
import { useCities } from "@/hooks/useCities";

export default function BookingPage() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const [routeId, setRouteId] = useState("")
  const [fromAirport, setFromAirport] = useState("");
  const [toAirport, setToAirport] = useState("");
  const [fromCityId, setFromCityId] = useState("");
  const [toCityId, setToCityId] = useState("");
  const [company, setCompany] = useState("");
  const [fromDatetime, setFromDatetime] = useState("");
  const [toDatetime, setToDatetime] = useState("");
  const [passengersCount, setPassengersCount] = useState(1);
  const [price, setPrice] = useState("");
  const [ticketClass, setTicketClass] = useState("");

  useEffect(() => {
    setRouteId(searchParams.get("routeId") || "");
    setFromAirport(searchParams.get("fromAirport") || "");
    setToAirport(searchParams.get("toAirport") || "");
    setFromCityId(searchParams.get("fromCityId") || "");
    setToCityId(searchParams.get("toCityId") || "");
    setCompany(searchParams.get("company") || "");
    setFromDatetime(searchParams.get("fromDatetime") || "");
    setToDatetime(searchParams.get("toDatetime") || "");
    setPassengersCount(Number(searchParams.get("passengersCount")));
    setPrice(searchParams.get("price") || "");
    setTicketClass(searchParams.get("ticketClass") || "");
  }, [searchParams])

  const { data: cities } = useCities(fromCityId, toCityId);

  const fromCity = cities?.fromCity
  const toCity = cities?.toCity

  const dayFrom = new Date(fromDatetime).getDate();
  const monthFrom = months[new Date(fromDatetime).getMonth() + 1];
  const yearFrom = new Date(fromDatetime).getFullYear();
  const hoursFrom = new Date(fromDatetime).getHours();
  const minutesFrom = new Date(fromDatetime).getMinutes();

  const dateFrom = `${dayFrom} ${monthFrom} ${yearFrom}`;
  const timeFrom = `${hoursFrom}:${minutesFrom}`;

  const dayTo = new Date(toDatetime).getDate();
  const monthTo = months[new Date(toDatetime).getMonth() + 1];
  const yearTo = new Date(toDatetime).getFullYear();
  const hoursTo = new Date(toDatetime).getHours();
  const minutesTo = new Date(toDatetime).getMinutes();

  const dateTo = `${dayTo} ${monthTo} ${yearTo}`;
  const timeTo = `${hoursTo}:${minutesTo}`;

  let passengerEnding;

  if (passengersCount == 1) {
    passengerEnding = "пассажир";
  } else if (2 <= passengersCount && passengersCount <= 4) {
    passengerEnding = "пассажира";
  } else if (5 <= passengersCount && passengersCount <= 9) {
    passengerEnding = "пассажиров";
  }

  const currentDate = new Date();

  const currentDay = currentDate.getDate();
  const currentMonth = months[currentDate.getMonth() + 1];
  const currentYear = currentDate.getFullYear();

  const currentDateFormatted = `${currentDay} ${currentMonth} ${currentYear}`;

  const [currentTab, setCurrentTab] = useState<"flight" | "passengerData">(
    "flight",
  );

  const { setCurrentReservationId } = useCartStore();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    const query = new URLSearchParams({
      id: routeId,
      fromCity,
      toCity,
      company,
      timeFrom,
      dateFrom,
      bookingDate: currentDateFormatted,
      price,
    });

    const reservation = await fetch(`/api/booking?${query}`, {
      method: "POST",
    }).then((res) => res.json());

    await setCurrentReservationId(reservation.reservation.id);

    const bookingSuccessQuery = new URLSearchParams({
      routeId,
      fromCityId,
      toCityId,
      company,
      fromDatetime,
      bookingDate: currentDateFormatted,
      price,
    });

    router.push(`/booking-success-page?${bookingSuccessQuery}`);
  };

  return (
    <Layout>
      <div className="flex flex-col justify-self-center w-full md:w-auto gap-3">
        <div className="flex items-center gap-2 md:mb-6">
          <Arrow className="hidden lg:inline" />
          <h1 className="text-xl md:text-3xl font-bold">Бронирование</h1>
        </div>
        <nav className="inline md:hidden">
          <ul className='flex gap-3.5 relative after:content-[""] after:h-[1px] after:bg-gray-300 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'>
            <li
              className={`flex relative px-4 text-sm ${
                currentTab === "flight"
                  ? 'text-blue-500 after:content-[""] after:h-0.5 after:bg-blue-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'
                  : "text-gray-500"
              }`}
              onClick={() => setCurrentTab("flight")}
            >
              Рейс
            </li>
            <li
              className={`flex relative px-4 text-sm ${
                currentTab === "passengerData"
                  ? 'text-blue-500 after:content-[""] after:h-0.5 after:bg-blue-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-full'
                  : "text-gray-500"
              }`}
              onClick={() => setCurrentTab("passengerData")}
            >
              Данные пассажира
            </li>
          </ul>
        </nav>
        <form
          className="flex flex-col gap-5 lg:flex-row"
          onSubmit={handleSubmit}
        >
          <div
            className={`flex flex-col md:gap-3 bg-white px-6 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg`}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-0 leading-none">
              Рейс
            </h2>
            <div
              className={`grid grid-rows-auto md:grid-cols-3 gap-1.5 md:gap-3 bg-white ${
                currentTab === "flight" ? "flex" : "hidden"
              } max-w-[622px]`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2 self-start">
                  <div className="flex gap-2 items-center text-sm md:text-base">
                    <p className="whitespace-nowrap">{`${cities?.fromCity} ${fromAirport}`}</p>
                    <Arrow className="rotate-180 w-5 h-2.5" />
                    <p className="whitespace-nowrap">{`${cities?.toCity} ${toAirport}`}</p>
                  </div>
                  <div className="flex gap-2 items-center text-sm md:text-base">
                    <p>{`${dateFrom} ${timeFrom}`}</p>
                    <Arrow className="rotate-180 w-5 h-2.5" />
                    <p>{dayTo > dayFrom ? `${dateTo} ${timeTo}` : timeTo}</p>
                  </div>
                </div>
                <div className="flex flex-row gap-1 md:w-[225px] md:flex-col justify-between">
                  <p className="text-gray-400 text-xs">Пассажиров</p>
                  <p className="text-sm md:text-base">{`${passengersCount} ${passengerEnding}`}</p>
                </div>
              </div>
              <div className="flex gap-1 md:flex-col self-end justify-between md:justify-self-center w-full md:w-auto">
                <p className="text-gray-400 text-xs">Класс</p>
                <p className="text-sm md:text-base">{ticketClass}</p>
              </div>
              <div className="flex flex-col gap-1.5 justify-between justify-self-end w-full md:w-auto">
                <div className="flex md:flex-col gap-1 items-center self-stretch md:self-start md:items-start justify-between">
                  <p className="text-gray-400 text-xs h-4">Авиакомпания</p>
                  <p className="text-sm md:text-base">«{company}»</p>
                </div>
                <div className="flex flex-row gap-1 md:flex-col justify-between">
                  <p className="text-gray-400 text-xs">Цена</p>
                  <p className="text-sm md:text-base">
                    {price.toLocaleString()} ₽
                  </p>
                </div>
              </div>
            </div>
            <Separator extraClass="hidden md:flex" />
            <div
              className={`flex flex-col gap-3 ${
                currentTab === "passengerData" ? "flex" : "hidden"
              } md:flex`}
            >
              {(() => {
                const passengers = [];
                for (let count = 1; count <= passengersCount; count++) {
                  passengers.push(
                    <PassengerInputs count={count} key={count} />,
                  );
                }
                return passengers;
              })()}
            </div>
          </div>
          <div className="flex flex-col gap-3 bg-white md:rounded-lg px-5 md:px-4 py-5 shadow-[0_4px_8px_rgba(0,0,0,0.15)] self-start w-screen md:w-auto ms-[-20px] md:ms-0">
            <div className="flex justify-between items-end">
              <p className="text-gray-500 text-xs">Общая сумма:</p>
              <p className="text-green-500 text-2xl font-bold leading-none">
                {price.toLocaleString()} ₽
              </p>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-gray-100 px-16 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-300 text-sm md:text-base"
            >
              Забронировать
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
