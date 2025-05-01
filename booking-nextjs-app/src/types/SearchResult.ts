export const ticketClassMap: Record<string, string> = {
  Эконом: "ECONOMY",
  Комфорт: "COMFORT",
  Бизнес: "BUSINESS",
  Первый: "FIRST",
};

export const layovers = [
  { id: 1, name: "Без пересадок", state: "noTransfers" },
  { id: 2, name: "1 пересадка", state: "oneTransfer" },
  { id: 3, name: "2 пересадки", state: "twoTransfers" },
  { id: 4, name: "3 пересадки", state: "threeTransfers" },
];

export const typeSort = [
  { id: "1", name: "дешевые → дорогие", type: "asc" },
  { id: "2", name: "дорогие → дешевые", type: "desc" },
];

interface Airport {
  id: string;
  cityId: string;
  code: string;
  name: string;
}

export interface Flight {
  id: string;
  from: Airport;
  to: Airport;
  departure: string;
  arrival: string;
  company: string;
  flightNumber: string;
  ticketClass: string;
  price: number;
}

export interface Layover {
  id: string
  airport: Airport
  durationMs: number
  durationString: string
  fromFlightId: string
  toFlightId: string
}

export interface RouteDto {
  id: string;
  hash: string;
  totalPrice: number;
  stops: number;
  durationString: string
  airlines: string[]
  flights: Flight[];
  layovers: Layover[]
}

export const monthsMap: Record<string, number> = {
  января: 0,
  февраля: 1,
  марта: 2,
  апреля: 3,
  мая: 4,
  июня: 5,
  июля: 6,
  августа: 7,
  сентября: 8,
  октября: 9,
  ноября: 10,
  декабря: 11,
};

export const monthNames = [
  "",
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