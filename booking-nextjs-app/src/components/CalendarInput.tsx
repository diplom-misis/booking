import { Popover } from "@headlessui/react";
import { DayButtonProps, DayPicker } from "react-day-picker";
import { DateTime } from "luxon";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { ru } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import { useRoutePrices } from "@/hooks/useRoutePrices";
import { useEffect, useState } from "react";
import React from "react";
import { cn } from "@/utils/cn";
import { PriceData } from "@/types/Search";

interface CalendarInputProps {
  className?: string;
  disabled?: boolean;
  placeholder: string;
  hideCalendarIcon?: boolean;
  required?: boolean;
  value: Date | null;
  onChange: (date: Date | null) => void;
  fromAirport?: string | null;
  toAirport?: string | null;
  error?: boolean;
}

function DayPrice(props: DayButtonProps) {
  const { day, modifiers, ...buttonProps } = props;
  const { prices } = React.useContext(PricesContext);

  const dateString = DateTime.fromJSDate(day.date).toFormat("yyyy-MM-dd");

  const priceInfo = prices.find((item: PriceData) => {
    const itemDate = DateTime.fromISO(item.date).toFormat("yyyy-MM-dd");
    return itemDate === dateString;
  });

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="flex flex-col gap-[1px]">
      <button {...buttonProps} />
      {priceInfo ? (
        <span className="text-xs text-green-500">
          {formatPrice(priceInfo.minPrice)}
        </span>
      ) : (
        <div className="h-4"></div>
      )}
    </div>
  );
}

const PricesContext = React.createContext<{ prices: PriceData[] }>({
  prices: [],
});

export default function CalendarInput(props: CalendarInputProps) {
  const {
    className,
    disabled,
    placeholder,
    hideCalendarIcon,
    required,
    value,
    onChange,
    fromAirport,
    toAirport,
    error,
  } = props;

  const [wasOpened, setWasOpened] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<Date>(
    new Date(new Date().getFullYear(), 3),
  );
  const [prices, setPrices] = useState<PriceData[]>([]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth() + 1;

  const { data: pricesData, refetch } = useRoutePrices(
    fromAirport || null,
    toAirport || null,
    year,
    month,
    false,
  );

  useEffect(() => {
    if (pricesData) {
      setPrices(pricesData);
    }
  }, [pricesData]);

  const handleDateChange = (date: Date | undefined) => {
    onChange(date || null);
  };

  const handleMonthChange = (date: Date) => {
    const now = new Date();

    if (
      date.getFullYear() < now.getFullYear() ||
      (date.getFullYear() === now.getFullYear() &&
        date.getMonth() < now.getMonth())
    ) {
      return;
    }

    setVisibleMonth(date);
  };

  useEffect(() => {
    if (wasOpened && fromAirport && toAirport) {
      refetch();
    }
  }, [visibleMonth, wasOpened, fromAirport, toAirport, refetch]);

  return (
    <PricesContext.Provider value={{ prices }}>
      <Popover className="relative">
        {({ open }) => {
          useEffect(() => {
            if (open && !wasOpened) {
              setWasOpened(true);
              setVisibleMonth(new Date(new Date().getFullYear(), 3));
            }
          }, [open]);

          return (
            <>
              <Popover.Button
                disabled={disabled}
                className={cn(
                  `border ${
                    error
                      ? "border-red-500"
                      : open
                        ? "border-blue-500"
                        : "border-gray-300"
                  } p-2 rounded-[4px] flex items-center justify-between bg-white`,
                  className,
                )}
                style={{
                  backgroundColor: disabled ? "#F9FAFB" : "",
                }}
              >
                <span
                  className={`${!value ? "text-gray-300" : "text-gray-800"} font-inter`}
                >
                  {value
                    ? DateTime.fromJSDate(value).toFormat("d MMMM yyyy", {
                        locale: "ru",
                      })
                    : placeholder}
                </span>
                {!hideCalendarIcon && (
                  <CalendarIcon className="w-5 h-5 text-gray-500" />
                )}
              </Popover.Button>

              <Popover.Panel className="absolute z-10 mt-2 bg-white p-4 shadow-lg rounded-lg">
                <DayPicker
                  locale={ru}
                  mode="single"
                  selected={value || undefined}
                  onSelect={handleDateChange}
                  onMonthChange={handleMonthChange}
                  fromMonth={new Date()}
                  month={visibleMonth}
                  classNames={{
                    nav_button: "text-gray-800",
                  }}
                  components={{
                    DayButton: DayPrice,
                  }}
                  required={required}
                />
              </Popover.Panel>
            </>
          );
        }}
      </Popover>
    </PricesContext.Provider>
  );
}
