import { useEffect, useState } from "react";
import Layout from "../layout";
import { Field, Label, Button, Checkbox } from "@headlessui/react";
import { useRouter, useSearchParams } from "next/navigation";
import CalendarInput from "@/components/CalendarInput";
import SelectInput from "@/components/SelectInput";
import { useForm } from "react-hook-form";
import PassengersSelect from "@/components/PassengersSelect";
import { useCityStore } from "@/store/useCityStore";
import { useAirportStore } from "@/store/useAirportStore";
import { useDebounce } from "@/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/booking";
import {
  selectDataAirport,
  typeClass,
  FormData,
  FormDataKeys,
} from "@/types/Search";

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

export default function BookingAirplane() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fromCity: null,
      fromAirport: null,
      toCity: null,
      toAirport: null,
      passengers: { Взрослые: 1, Дети: 0, Младенцы: 0 },
      classType: typeClass[0],
      departureDate: null,
      returnDate: null,
      isOneWay: false,
    },
  });

  const formValues = watch();

  const { fromCities, toCities, searchFromCities, searchToCities } =
    useCityStore();

  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const debouncedFromSearch = useDebounce(fromSearchQuery, 300);

  const [toSearchQuery, setToSearchQuery] = useState("");
  const debouncedToSearch = useDebounce(toSearchQuery, 300);

  useEffect(() => {
    const cityTo = searchParams.get("toCity");

    if (cityTo) {
      setToSearchQuery(cityTo);
      searchFromCities(toSearchQuery);
      const matchedCity = toCities.find((city) => city.name === cityTo);

      if (matchedCity) {
        setValue("toCity", matchedCity);
      }
    }
  }, [searchParams, toCities, setValue, searchFromCities, toSearchQuery]);

  useEffect(() => {
    if (debouncedFromSearch) {
      searchFromCities(debouncedFromSearch);
    }
  }, [debouncedFromSearch, searchFromCities]);

  useEffect(() => {
    if (debouncedToSearch) {
      searchToCities(debouncedToSearch);
    }
  }, [debouncedToSearch, searchToCities]);

  const { airportsFrom, airportsTo, loadAirportsFrom, loadAirportsTo } =
    useAirportStore();

  useEffect(() => {
    if (formValues.fromCity?.id) {
      loadAirportsFrom(formValues.fromCity.id);
    } else {
      setValue("fromAirport", null);
    }
  }, [formValues.fromCity?.id, loadAirportsFrom, setValue]);

  useEffect(() => {
    if (formValues.toCity?.id) {
      loadAirportsTo(formValues.toCity.id);
    } else {
      setValue("toAirport", null);
    }
  }, [formValues.toCity?.id, loadAirportsTo, setValue]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name && errors[name as FormDataKeys]) {
        clearErrors(name as FormDataKeys);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, errors, clearErrors]);

  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);

      if (parsedData.departureDate) {
        parsedData.departureDate = new Date(parsedData.departureDate);
      }
      if (parsedData.returnDate) {
        parsedData.returnDate = new Date(parsedData.returnDate);
      }

      reset(parsedData);
    }
  }, [reset]);

  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formValues));
    if (typeof window !== "undefined" && window.location.search) {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
    }
  }, [formValues]);

  const handleCheckboxChange = () => {
    const newEnabledState = !formValues.isOneWay;
    setValue("isOneWay", newEnabledState);
    if (newEnabledState) {
      setValue("returnDate", null);
    }
  };

  const onSubmit = (data: FormData) => {
    const {
      fromCity,
      fromAirport,
      toCity,
      toAirport,
      departureDate,
      returnDate,
      classType,
      passengers,
      isOneWay,
    } = data;

    const totalPassengers = Object.values(passengers).reduce(
      (acc, count) => acc + count,
      0,
    );

    const queryString = new URLSearchParams({
      cityFrom: fromCity?.name || "",
      airportFrom: fromAirport?.code || "",
      dateFrom: formatDate(departureDate),
      cityTo: toCity?.name || "",
      airportTo: toAirport?.code || "",
      dateTo: isOneWay ? "" : formatDate(returnDate),
      class: classType?.name || "",
      passengers: totalPassengers.toString(),
    }).toString();

    router.push(`/results-search?${queryString}`);
  };

  const handleFromCitySearch = (query: string) => {
    setFromSearchQuery(query);
  };

  const handleToCitySearch = (query: string) => {
    setToSearchQuery(query);
  };

  return (
    <Layout>
      <div className="flex flex-col justify-self-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-6 font-roboto">
          Поиск авиабилетов
        </h1>
        <div className="sm:bg-white sm:rounded-xl sm:border">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="sm:px-6 py-8 flex flex-col gap-4"
          >
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              <div className="flex flex-row gap-2 w-full md:w-auto">
                <div className="flex flex-col gap-1 w-full md:w-[160px]">
                  <SelectInput
                    {...register("fromCity")}
                    className="h-10 w-full md:w-[160px] px-[14px] py-[8px]"
                    title="Откуда"
                    data={fromCities}
                    value={formValues.fromCity}
                    typeCombobox={false}
                    placeholder={"Лукоморье*"}
                    onChange={(value) => setValue("fromCity", value)}
                    onSearch={handleFromCitySearch}
                    error={!!errors.fromCity}
                  />
                  {errors.fromCity && (
                    <p className="text-red-500 text-xs">
                      {errors.fromCity.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-[88px]">
                  <SelectInput
                    {...register("fromAirport")}
                    className="h-10 w-[88px] px-[10px] py-[10px]"
                    title="Аэропорт"
                    data={airportsFrom}
                    value={formValues.fromAirport}
                    placeholder={"LKMR*"}
                    disabled
                    typeCombobox={true}
                    onChange={(value) =>
                      setValue("fromAirport", value as selectDataAirport)
                    }
                    error={!!errors.fromAirport}
                  />
                  {errors.fromAirport && (
                    <p className="text-red-500 text-xs break-words whitespace-normal max-w-[88px]">
                      {errors.fromAirport.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-2 w-full md:w-auto">
                <div className="flex flex-col gap-1 w-full md:w-[160px]">
                  <SelectInput
                    className="h-10 w-full md:w-[160px] px-[14px] py-[8px]"
                    title="Куда"
                    data={toCities}
                    value={formValues.toCity}
                    typeCombobox={false}
                    placeholder={"Тридевятье*"}
                    {...register("toCity")}
                    onChange={(value) => setValue("toCity", value)}
                    onSearch={handleToCitySearch}
                    error={!!errors.toCity}
                  />
                  {errors.toCity && (
                    <p className="text-red-500 text-xs">
                      {errors.toCity.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1 w-[88px]">
                  <SelectInput
                    {...register("toAirport")}
                    className="h-10 w-[88px] px-[10px] py-[10px]"
                    title="Аэропорт"
                    data={airportsTo}
                    value={formValues.toAirport}
                    placeholder={"39*"}
                    disabled={true}
                    typeCombobox={true}
                    onChange={(value) =>
                      setValue("toAirport", value as selectDataAirport)
                    }
                    error={!!errors.toAirport}
                  />
                  {errors.toAirport && (
                    <p className="text-red-500 text-xs break-words whitespace-normal max-w-[88px]">
                      {errors.toAirport.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <PassengersSelect
                className="w-full sm:w-[262px]"
                value={formValues.passengers}
                onChange={(value) => setValue("passengers", value)}
              />
              <div className="flex flex-col gap-1 w-full sm:w-[262px]">
                <SelectInput
                  {...register("classType")}
                  className="h-11 w-full sm:w-[262px] px-[14px] py-[10px]"
                  title="Класс"
                  data={typeClass}
                  value={formValues.classType}
                  disabled={false}
                  defaultValue={typeClass[0].name}
                  typeCombobox={true}
                  onChange={(value) => setValue("classType", value)}
                  error={!!errors.classType}
                />
                {errors.classType && (
                  <p className="text-red-500 text-xs">
                    {errors.classType.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-2">
              <div className="flex flex-col gap-1 w-full sm:w-[262px]">
                <CalendarInput
                  {...register("departureDate")}
                  className="w-full sm:w-[262px]"
                  value={formValues.departureDate}
                  placeholder={"Выберите дату*"}
                  onChange={(date) => setValue("departureDate", date)}
                  fromAirport={formValues.fromAirport?.code}
                  toAirport={formValues.toAirport?.code}
                  error={!!errors.departureDate}
                />
                {errors.departureDate && (
                  <p className="text-red-500 text-xs">
                    {errors.departureDate.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1 w-full sm:w-[262px]">
                <CalendarInput
                  {...register("returnDate")}
                  className="w-full sm:w-[262px]"
                  value={formValues.returnDate || null}
                  disabled={formValues.isOneWay}
                  placeholder={
                    formValues.isOneWay
                      ? "Без обратного билета"
                      : "Выберите дату*"
                  }
                  hideCalendarIcon={formValues.isOneWay}
                  onChange={(date) => setValue("returnDate", date)}
                  fromAirport={formValues.toAirport?.code}
                  toAirport={formValues.fromAirport?.code}
                  error={!!errors.returnDate}
                />
                {errors.returnDate && (
                  <p className="text-red-500 text-xs break-words whitespace-normal">
                    {errors.returnDate.message}
                  </p>
                )}
                <Field className="flex items-center gap-2 mt-2 sm:mt-0">
                  <Checkbox
                    checked={formValues.isOneWay}
                    onChange={handleCheckboxChange}
                    className="group flex items-center justify-center size-4 rounded-sm border border-blue-500 bg-white"
                  >
                    {formValues.isOneWay && (
                      <div className="absolute size-[10px] bg-blue-500 rounded-sm"></div>
                    )}
                  </Checkbox>
                  <Label className="text-sm font-inter text-gray-800">
                    Обратный билет не нужен
                  </Label>
                </Field>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full sm:w-[262px] rounded bg-blue-500 py-2 px-4 text-gray-100 data-[hover]:bg-sky-500 data-[active]:bg-sky-700 "
            >
              <p className="text-base font-inter font-bold">Найти</p>
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
