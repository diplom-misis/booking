import { Reservation, Status } from "@prisma/client";
import { Separator } from "./separator";
import { SyntheticEvent, useState } from "react";
import { Arrow } from "./arrow";

type ReservationCardData = {
  reservationData: Reservation;
};

export default function ReservationCard({
  reservationData,
}: ReservationCardData) {  
  const [isOpen, setIsOpen] = useState(true);

  const id = reservationData.id

  const {
    fromCity,
    toCity,
    company,
    timeFrom,
    dateFrom,
    bookingDate,
    price,
  } = JSON.parse(JSON.stringify(reservationData)).data;

  const status = reservationData.status;

  const handleBook = async (e: SyntheticEvent) => {
    e.preventDefault();

    const query = new URLSearchParams({
      id,
      fromCity,
      toCity,
      company,
      timeFrom,
      dateFrom,
      bookingDate,
      price,
    });

    await fetch(`/api/booking?${query}`, {
      method: "POST",
    });
  };

  const handleComplete = async (e: SyntheticEvent) => {
    e.preventDefault();

    console.log(reservationData)

    await fetch(`/api/booking`, {
      method: "PATCH",
      body: JSON.stringify({
        id: reservationData.id,
        data: {
          status: Status.COMPLETE,
        },
      }),
    });
  };

  const handleDelete = async (e: SyntheticEvent) => {
    e.preventDefault();

    await fetch(`/api/booking`, {
      method: "DELETE",
      body: JSON.stringify({
        id: reservationData.id,
      }),
    });
  };

  const handleOpenClose = async () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <form className="flex flex-col justify-self-center gap-6 max-w-[780px]">
      <div className="flex flex-col gap-3.5 md:gap-4 bg-white p-4 md:p-6 shadow-[0_4px_8px_rgba(0,0,0,0.15)] rounded-lg">
        <div className="grid grid-cols-2 grid-rows-2 md:grid-rows-1 md:grid-cols-[3fr_3fr_1fr] gap-y-1 md:gap-y-0">
          <p className="md:text-2xl text-gray-800 font-bold">
            {id?.split("-")[0]}
          </p>
          <p className="md:text-2xl text-gray-800 font-bold md:font-normal justify-self-end md:justify-self-start">
            {bookingDate}
          </p>
          <p className="text-green-500 md:text-2xl md:justify-self-end font-bold md:font-normal whitespace-nowrap">
            {price.toLocaleString()} ₽
          </p>
        </div>
        <Separator />
        <div>
          {isOpen && (
            <div className="flex flex-col gap-3.5 md:gap-4">
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
                  Бесплатная отмена бронирования возможна до 10 декабря 2025,
                  23:59.
                </p>
                <p className="text-xs md:text-sm max-w-[700px] text-gray-800">
                  После указанного времени удерживается штраф в размере 50%
                  от стоимости билета.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                {status === "IN_PROCESSING" && (
                  <button
                    type="button"
                    className="bg-blue-500 text-gray-100 px-4 py-2 rounded-lg hover:bg-blue-600 active:bg-blue-700 text-sm md:text-base"
                    onClick={handleComplete}
                  >
                    Оформить заказ
                  </button>
                )}
                <button
                  type="button"
                  className="border border-gray-300 px-4 py-2 rounded-lg text-gray-800 font-bold hover:border-transparent text-sm md:text-base"
                  onClick={handleDelete}
                >
                  Отменить бронирование
                </button>
                <button
                  type="button"
                  className="border border-gray-300 px-4 py-2 rounded-lg text-gray-800 font-bold hover:border-transparent text-sm md:text-base"
                  onClick={handleBook}
                >
                  Забронировать повторно
                </button>
              </div>
              <Separator />
            </div>
          )}
        </div>
        <div
          className="flex gap-2 self-center md:self-start cursor-pointer"
          onClick={handleOpenClose}
        >
          <p className="text-blue-500 text-sm md:text-base">
            {isOpen ? "Свернуть" : "Показать полностью"}
          </p>
          <Arrow
            className={`[&_path]:stroke-blue-500 ${isOpen ? "rotate-90" : "-rotate-90"} w-5 h-2.5 self-center`}
          />
        </div>
      </div>
    </form>
  );
}
