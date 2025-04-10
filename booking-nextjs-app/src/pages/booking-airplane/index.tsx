import { useEffect, useState } from "react";
import { Layout } from "../layout";
import { Field, Label, Button, Checkbox } from "@headlessui/react";
import { useRouter } from "next/navigation";
import CalendarInput from "@/components/CalendarInput";
import SelectInput, {
  selectData,
  selectDataAirport,
} from "@/components/SelectInput";
import { useForm } from "react-hook-form";
import PassengersSelect from "@/components/PassengersSelect";
import { useCityStore } from "@/store/useCityStore";
import { useAirportStore } from "@/store/useAirportStore";
import { useDebounce } from "@/hooks/useDebounce";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema } from "../../schemas/booking";

const typeClass = [
  { id: "1", name: "Эконом" },
  { id: "2", name: "Комфорт" },
  { id: "3", name: "Бизнес" },
  { id: "4", name: "Первый" },
];

const formatDate = (date: Date | null | undefined) => {
  if (!date) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}${month}${year}`;
};

type FormData = {
  fromCity: selectData | null;
  fromAirport: selectDataAirport | null;
  toCity: selectData | null;
  toAirport: selectDataAirport | null;
  passengers: { Взрослые: number; Дети: number; Младенцы: number };
  classType: selectData | null;
  departureDate: Date | null;
  returnDate?: Date | null | undefined;
  isOneWay: boolean;
};

type FormDataKeys = keyof FormData;

export default function BookingAirplane() {
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

  const {
    fromCities,
    toCities,
    searchFromCities,
    searchToCities,
  } = useCityStore();

  const [fromSearchQuery, setFromSearchQuery] = useState("");
  const debouncedFromSearch = useDebounce(fromSearchQuery, 300);

  const [toSearchQuery, setToSearchQuery] = useState("");
  const debouncedToSearch = useDebounce(toSearchQuery, 300);

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

  const {
    airportsFrom,
    airportsTo,
    loadAirportsFrom,
    loadAirportsTo,
  } = useAirportStore();

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
        <h1 className="text-2xl font-bold mb-6">Поиск авиабилетов</h1>
        <div className="bg-white rounded-xl border">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="px-6 py-8 flex flex-col gap-4"
          >
            <div className="flex flex-row gap-5">
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-1">
                  <SelectInput
                    {...register("fromCity")}
                    className="h-10 w-[160px] px-[14px] py-[8px]"
                    title="Откуда"
                    data={fromCities}
                    value={formValues.fromCity}
                    typeCombobox={false}
                    placeholder={"Лукоморье*"}
                    onChange={(value) => setValue("fromCity", value)}
                    onSearch={handleFromCitySearch}
                  />
                  {errors.fromCity && (
                    <p className="text-red-500 text-xs">{errors.fromCity.message}</p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
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
                  />  
                  {errors.fromAirport && (
                    <p className="text-red-500 text-xs break-words whitespace-normal max-w-[88px]">{errors.fromAirport.message}</p>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-1">
                  <SelectInput
                    className="h-10 w-[160px] px-[14px] py-[8px]"
                    title="Куда"
                    data={toCities}
                    value={formValues.toCity}
                    typeCombobox={false}
                    placeholder={"Тридевятье*"}
                    {...register("toCity")}
                    onChange={(value) => setValue("toCity", value)}
                    onSearch={handleToCitySearch}
                  />
                  {errors.toCity && (
                    <p className="text-red-500 text-xs">
                      {errors.toCity.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
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
                  />
                  {errors.toAirport && (
                    <p className="text-red-500 text-xs break-words whitespace-normal max-w-[88px]">
                      {errors.toAirport.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <PassengersSelect
                value={formValues.passengers}
                onChange={(value) => setValue("passengers", value)}
              />
              <div className="flex flex-col gap-1">
                <SelectInput
                  {...register("classType")}
                  className="h-11 w-[262px] px-[14px] py-[10px]"
                  title="Класс"
                  data={typeClass}
                  value={formValues.classType}
                  disabled={false}
                  defaultValue={typeClass[0].name}
                  typeCombobox={true}
                  onChange={(value) => setValue("classType", value)}
                />
                {errors.classType && (
                  <p className="text-red-500 text-xs">{errors.classType.message}</p>
                )}
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-1">
                <CalendarInput
                  {...register("departureDate")}
                  value={formValues.departureDate}
                  placeholder={"Выберите дату*"}
                  onChange={(date) => setValue("departureDate", date)}
                />
                {errors.departureDate && (
                  <p className="text-red-500 text-xs">{errors.departureDate.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <CalendarInput
                  {...register("returnDate")}
                  value={formValues.returnDate || null}
                  disabled={formValues.isOneWay}
                  placeholder={
                    formValues.isOneWay
                      ? "Без обратного билета"
                      : "Выберите дату*"
                  }
                  hideCalendarIcon={formValues.isOneWay}
                  onChange={(date) => setValue("returnDate", date)}
                />
                {errors.returnDate && (
                  <p className="text-red-500 text-xs break-words whitespace-normal max-w-[262px]">{errors.returnDate.message}</p>
                )}
                <Field className="flex items-center gap-2">
                  <Checkbox
                    checked={formValues.isOneWay}
                    onChange={handleCheckboxChange}
                    className="group flex items-center justify-center size-4 rounded-sm border border-blue-500 bg-white"
                  >
                    {formValues.isOneWay && (
                      <div className="absolute  size-[10px] bg-blue-500 rounded-sm"></div>
                    )}
                  </Checkbox>
                  <Label className="text-sm text-gray-800">
                    Обратный билет не нужен
                  </Label>
                </Field>
              </div>
            </div>
            <Button
              type="submit"
              className="w-[262px] rounded bg-blue-500 py-2 px-4 text-m font-semibold text-white data-[hover]:bg-sky-500 data-[active]:bg-sky-700"
            >
              Найти
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
