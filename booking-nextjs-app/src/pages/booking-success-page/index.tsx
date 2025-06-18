import { Separator } from "@/components/separator";
import Layout from "../layout";
import { months } from "@/utils/constants";
import { SyntheticEvent, useEffect, useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useCities } from "@/hooks/useCities";
import { useRouter } from "next/router";
import { Status } from '@prisma/client';
import { useSearchParams } from 'next/navigation';

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  
    const [routeId, setRouteId] = useState("")
    const [fromCityId, setFromCityId] = useState("");
    const [toCityId, setToCityId] = useState("");
    const [company, setCompany] = useState("");
    const [fromDatetime, setFromDatetime] = useState("");
    const [price, setPrice] = useState("");
  
    useEffect(() => {
      setRouteId(searchParams.get("routeId") || "");
      setFromCityId(searchParams.get("fromCityId") || "");
      setToCityId(searchParams.get("toCityId") || "");
      setCompany(searchParams.get("company") || "");
      setFromDatetime(searchParams.get("fromDatetime") || "");
      setPrice(searchParams.get("price") || "");
    }, [searchParams])

  const { data: cities } = useCities(fromCityId, toCityId);

  const fromCity = cities?.fromCity;
  const toCity = cities?.toCity;

  const dayFrom = new Date(fromDatetime).getDate();
  const monthFrom = months[new Date(fromDatetime).getMonth() + 1];
  const yearFrom = new Date(fromDatetime).getFullYear();
  const hoursFrom = new Date(fromDatetime).getHours();
  const minutesFrom = new Date(fromDatetime).getMinutes();

  const dateFrom = `${dayFrom} ${monthFrom} ${yearFrom}`;
  const timeFrom = `${hoursFrom}:${minutesFrom}`;

  const currentDate = new Date();

  const currentDay = currentDate.getDate();
  const currentMonth = months[currentDate.getMonth() + 1];
  const currentYear = currentDate.getFullYear();

  const currentDateFormatted = `${currentDay} ${currentMonth} ${currentYear}`;

  const router = useRouter();

  const currentReservationId = useCartStore().getCurrentReservationId()

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    console.log(currentReservationId)

    await fetch(`/api/booking`, {
      method: "PATCH",
      body: JSON.stringify({
        id: currentReservationId,
        data: {
          status: Status.COMPLETE,
        },
      }),
    });

    router.push("/all-bookings-page");
  };

  return (
    <Layout>
      <form
        className="flex flex-col justify-self-center gap-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl md:text-3xl font-bold text-gray-800">
          Ваше бронирование подтверждено!
        </h2>
        <div className="flex flex-col gap-3.5 md:gap-4 bg-white p-6 shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg">
          <div className="grid grid-cols-2 grid-rows-2 md:grid-rows-1 md:grid-cols-[3fr_3fr_1fr] gap-y-1 md:gap-y-0">
            <p className="md:text-2xl text-gray-800 font-bold">
              {routeId.split("-")[0]}
            </p>
            <p className="md:text-2xl text-gray-800 font-bold md:font-normal justify-self-end md:justify-self-start">
              {currentDateFormatted}
            </p>
            <p className="text-green-500 md:text-2xl md:justify-self-end">
              {price.toLocaleString()} ₽
            </p>
          </div>
          <Separator />
          <div className="flex flex-col md:flex-row gap-1 md:gap-0">
            <p className="text-gray-800 font-bold w-40 text-sm md:text-base">
              Детали рейса
            </p>
            <div className="flex flex-row md:flex-col gap-1 w-full md:w-[200px] justify-between">
              <p className="text-gray-400 text-xs">Отправление</p>
              <p className="text-gray-800 text-sm">{`${fromCity} → ${toCity}`}</p>
            </div>
            <div className="flex flex-row md:flex-col gap-1 w-full md:w-[200px] justify-between">
              <p className="text-gray-400 text-xs">Дата и время</p>
              <p className="text-gray-800 text-sm">{`${timeFrom} ${dateFrom}`}</p>
            </div>
            <div className="flex flex-row md:flex-col gap-1 w-full md:w-[200px] justify-between">
              <p className="text-gray-400 text-xs">Авиакомпания</p>
              <p className="text-gray-800 text-sm">«{company}»</p>
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-0.5">
            <div className="flex flex-col md:flex-row gap-1 md:gap-0">
              <p className="text-gray-800 font-bold w-40 text-sm md:text-base">
                Способы оплаты
              </p>
              <p className="text-gray-800 text-sm w-[200px]">
                Банковская карта
              </p>
              <p className="text-gray-800 text-sm w-[200px]">
                Электронные кошельки
              </p>
              <p className="text-gray-800 text-sm max-w-[200px]">
                Банковский перевод*
              </p>
            </div>
            <p className="text-gray-400 text-xs">
              *При оплате переводом укажите номер бронирования в комментарии
              к платежу
            </p>
          </div>
          <Separator />
          <div>
            <p className="text-xs md:text-sm max-w-[700px] text-gray-800">
              Бесплатная отмена бронирования возможна до 10 декабря 2024, 23:59.
            </p>
            <p className="text-xs md:text-sm max-w-[700px] text-gray-800">
              После указанного времени удерживается штраф в размере 50%
              от стоимости билета.
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse md:flex-row gap-2">
          <button
            type="submit"
            className="bg-blue-500 text-gray-100 px-4 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700"
            onSubmit={handleSubmit}
          >
            Оформить заказ
          </button>
        </div>
      </form>
    </Layout>
  );
}
