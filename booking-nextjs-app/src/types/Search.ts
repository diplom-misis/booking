export type selectData = { id: string; name: string };
export type selectDataAirport = {
  id: string;
  name: string;
  code: string;
};

export type FormData = {
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

export type FormDataKeys = keyof FormData;

export const typeClass = [
  { id: "1", name: "Эконом" },
  { id: "2", name: "Комфорт" },
  { id: "3", name: "Бизнес" },
  { id: "4", name: "Первый" },
];

export interface PriceData {
  date: string;
  minPrice: number;
}

export type PassengerType = {
  id: number;
  name: keyof PassengersCount;
};

export type PassengersCount = {
  Взрослые: number;
  Дети: number;
  Младенцы: number;
};
