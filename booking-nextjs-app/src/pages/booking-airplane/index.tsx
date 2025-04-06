import { useEffect } from "react";
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

const typeClass = [
  { id: "1", name: "Эконом" },
  { id: "2", name: "Комфорт" },
  { id: "3", name: "Бизнес" },
  { id: "4", name: "Первый" },
];

const formatDate = (date: Date | undefined) => {
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
  departureDate: Date | undefined;
  returnDate: Date | undefined;
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
    getValues,
    reset,
    clearErrors,
  } = useForm<FormData>({
    defaultValues: {
      fromCity: null,
      fromAirport: null,
      toCity: null,
      toAirport: null,
      passengers: { Взрослые: 1, Дети: 0, Младенцы: 0 },
      classType: typeClass[0],
      departureDate: undefined,
      returnDate: undefined,
      isOneWay: false,
    },
  });

  const formValues = watch();

  const { cities, isLoading: citiesLoading, loadCities } = useCityStore();
  const {
    airportsFrom,
    airportsTo,
    isLoading: airportsLoading,
    loadAirportsFrom,
    loadAirportsTo,
  } = useAirportStore();

  useEffect(() => {
    loadCities();
  }, [loadCities]);

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
      setValue("returnDate", undefined);
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
                    {...register("fromCity", {
                      required: "Это поле обязательно",
                    })}
                    className="h-10 w-[160px] px-[14px] py-[8px]"
                    title="Откуда"
                    data={cities.filter(
                      (city) => city.id !== formValues.toCity?.id,
                    )}
                    value={formValues.fromCity}
                    typeCombobox={false}
                    placeholder={"Лукоморье"}
                    onChange={(value) => setValue("fromCity", value)}
                  />
                  {errors.fromCity && (
                    <p className="text-red-500 text-sm">
                      Это поле обязательное
                    </p>
                  )}
                </div>
                <SelectInput
                  {...register("fromAirport", {
                    required: "Это поле обязательно",
                  })}
                  className="h-10 w-[88px] px-[10px] py-[10px]"
                  title="Аэропорт"
                  data={airportsFrom}
                  value={formValues.fromAirport}
                  placeholder={"LKMR"}
                  disabled
                  typeCombobox={true}
                  onChange={(value) =>
                    setValue("fromAirport", value as selectDataAirport)
                  }
                />
              </div>
              <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-1">
                  <SelectInput
                    className="h-10 w-[160px] px-[14px] py-[8px]"
                    title="Куда"
                    data={cities.filter(
                      (city) => city.id !== formValues.fromCity?.id,
                    )}
                    value={formValues.toCity}
                    typeCombobox={false}
                    placeholder={"Тридевятье"}
                    {...register("toCity", {
                      required: "Это поле обязательно",
                    })}
                    onChange={(value) => setValue("toCity", value)}
                  />
                  {errors.toCity && (
                    <p className="text-red-500 text-sm">
                      Это поле обязательное
                    </p>
                  )}
                </div>
                <SelectInput
                  {...register("toAirport", {
                    required: "Это поле обязательно",
                  })}
                  className="h-10 w-[88px] px-[10px] py-[10px]"
                  title="Аэропорт"
                  data={airportsTo}
                  value={formValues.toAirport}
                  placeholder={"39"}
                  disabled={true}
                  typeCombobox={true}
                  onChange={(value) =>
                    setValue("toAirport", value as selectDataAirport)
                  }
                />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <PassengersSelect
                value={formValues.passengers}
                onChange={(value) => setValue("passengers", value)}
              />
              <SelectInput
                {...register("classType", {
                  required: "Это поле обязательно",
                })}
                className="h-11 w-[262px] px-[14px] py-[10px]"
                title="Класс"
                data={typeClass}
                value={formValues.classType}
                disabled={false}
                defaultValue={typeClass[0].name}
                typeCombobox={true}
                onChange={(value) => setValue("classType", value)}
              />
            </div>
            <div className="flex flex-row gap-2">
              <div className="flex flex-col gap-1">
                <CalendarInput
                  {...register("departureDate", {
                    required: "Это поле обязательно",
                  })}
                  value={formValues.departureDate}
                  placeholder={"Выберите дату"}
                  onChange={(date) => setValue("departureDate", date)}
                />
                {errors.departureDate && (
                  <p className="text-red-500 text-sm">Это поле обязательное</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <CalendarInput
                  {...register("returnDate", {
                    required: !formValues.isOneWay && "Это поле обязательно",
                  })}
                  value={formValues.returnDate}
                  disabled={formValues.isOneWay}
                  placeholder={
                    formValues.isOneWay
                      ? "Без обратного билета"
                      : "Выберите дату"
                  }
                  hideCalendarIcon={formValues.isOneWay}
                  onChange={(date) => setValue("returnDate", date)}
                />
                {errors.returnDate && (
                  <p className="text-red-500 text-sm">Это поле обязательное</p>
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
