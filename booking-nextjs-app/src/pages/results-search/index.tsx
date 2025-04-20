import { Layout } from "../layout";
import { useCallback, useEffect, useState } from "react";
import Filters from "@/components/filters";
import { Arrow } from "@/components/arrow";
import { useSearchParams } from "next/navigation";
import CheapFilter from "@/components/CheapFilter";
import RouteCard from "@/components/RouteCard";
import HotelsList from "@/components/HotelsList";
import { useRouteStore } from "@/store/useRouteStore";

const layovers = [
  { id: 1, name: "Без пересадок", state: "noTransfers" },
  { id: 2, name: "1 пересадка", state: "oneTransfer" },
  { id: 3, name: "2 пересадки", state: "twoTransfers" },
  { id: 4, name: "3 пересадки", state: "threeTransfers" },
];

const monthNames = [
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

const getPassengersLabel = (count: number) => {
  if (count === 1) {
    return "пассажир";
  } else if (count >= 2 && count <= 4) {
    return "пассажира";
  } else {
    return "пассажиров";
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr.length !== 8) return "";

  const day = dateStr.slice(0, 2);
  const month = Number(dateStr.slice(2, 4));
  const year = dateStr.slice(4, 8);

  return `${day} ${monthNames[month]} ${year}`;
};

const hotels = [
  {
    id: "1",
    name: "Златая палата",
    price: 2000,
    rating: 4.4,
  },
  {
    id: "2",
    name: "Златая палата",
    price: 2000,
    rating: 4.4,
  },
];

const monthsMap: Record<string, number> = {
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

const parseDateToISO = (dateStr: string): string | null => {
  if (!dateStr) return null;

  const [dayStr, monthStr, yearStr] = dateStr.split(" ");

  const month = monthsMap[monthStr.toLowerCase()];
  if (month === undefined) {
    return null;
  }

  const day = dayStr.padStart(2, "0");
  const year = yearStr;

  const isoDate = `${year}-${String(month + 1).padStart(2, "0")}-${day}`;
  return isoDate;
};

const ticketClassMap: Record<string, string> = {
  Эконом: "ECONOMY",
  Комфорт: "COMFORT",
  Бизнес: "BUSINESS",
  Первый: "FIRST",
};

export default function ResultsSearch() {
  const searchParams = useSearchParams();

  const [cityFrom, setCityFrom] = useState("");
  const [airportFrom, setAirportFrom] = useState("");
  const [cityTo, setCityTo] = useState("");
  const [airportTo, setAirportTo] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [classTicket, setClassTicket] = useState("");
  const [filtersCheap, setFiltersCheap] = useState<string[]>([]);
  const [airlines, setAirlines] = useState<
    { id: number; name: string; state: string }[]
  >([]);
  const {
    oneWayRoutes,
    returnRoutes,
    isLoading,
    error,
    fetchOneWayRoutes,
    fetchReturnRoutes,
  } = useRouteStore();

  const [transfersCheckboxes, setTransfersCheckboxes] = useState({
    noTransfers: false,
    oneTransfer: false,
    twoTransfers: false,
    threeTransfers: false,
  });

  const [airlineCheckboxes, setAirlineCheckboxes] = useState<
    Record<string, boolean>
  >({});
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedTransfers, setSelectedTransfers] = useState<number[]>([]);

  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [selectedSort, setSelectedSort] = useState({
    id: "1",
    name: "дешевые → дорогие",
    type: "asc",
  });

  // const sortedRoutesThere = routesThere.sort(
  //   (a, b) => a.totalPrice - b.totalPrice,
  // );
  // const sortedRoutesBack = routesBack.sort(
  //   (a, b) => a.totalPrice - b.totalPrice,
  // );

  // const pairedRoutes = sortedRoutesThere.map((routeThere, index) => ({
  //   routeThere,
  //   routeBack: sortedRoutesBack[index],
  // }));

  useEffect(() => {
    setCityFrom(searchParams.get("cityFrom") || "");
    setAirportFrom(searchParams.get("airportFrom") || "");
    setCityTo(searchParams.get("cityTo") || "");
    setAirportTo(searchParams.get("airportTo") || "");
    setDateFrom(formatDate(searchParams.get("dateFrom") || ""));
    setDateTo(formatDate(searchParams.get("dateTo") || ""));
    setPassengers(Number(searchParams.get("passengers")) || 1);
    setClassTicket(searchParams.get("class") || "");
  }, [searchParams]);

  useEffect(() => {
    const getCheapFilters = () => {
      const cheapFilters: string[] = [];
      Object.entries(transfersCheckboxes).forEach(([key, value]) => {
        if (value) {
          const layover = layovers.find((l) => l.state === key);
          if (layover) {
            cheapFilters.push(layover.name);
          }
        }
      });
      Object.entries(airlineCheckboxes).forEach(([key, value]) => {
        if (value) {
          const airline = airlines.find((a) => a.state === key);
          if (airline) {
            cheapFilters.push(airline.name);
          }
        }
      });
      if (priceRange.from) {
        cheapFilters.push(`От ${priceRange.from} ₽`);
      }
      if (priceRange.to) {
        cheapFilters.push(`До ${priceRange.to} ₽`);
      }

      cheapFilters.push(`${selectedSort.name}`);

      return cheapFilters;
    };

    const filters = getCheapFilters();
    setFiltersCheap(filters);
  }, [
    transfersCheckboxes,
    airlineCheckboxes,
    priceRange,
    selectedSort.name,
    airlines,
  ]);

  useEffect(() => {
    const allRoutes = [...oneWayRoutes, ...returnRoutes];
  
    if (allRoutes.length > 0) {
      const uniqueAirlines = Array.from(
        new Set<string>(
          allRoutes.flatMap((route) => route.airlines).filter(Boolean)
        )
      );
  
      const airlinesList = uniqueAirlines.map((airline, index) => ({
        id: index + 1,
        name: airline,
        state: airline.toLowerCase().replace(/\s+/g, '-'),
      }));
  
      setAirlines(airlinesList);
  
      setAirlineCheckboxes((prev) => {
        const newState = airlinesList.reduce(
          (acc, airline) => {
            acc[airline.state] = prev[airline.state] || false;
            return acc;
          },
          {} as Record<string, boolean>,
        );
        return newState;
      });
    }
  }, [oneWayRoutes, returnRoutes]);

  useEffect(() => {
    if (!airportFrom || !airportTo || !classTicket || !passengers) return;

    if (dateFrom) {
      fetchOneWayRoutes({
        fromAirport: airportFrom,
        toAirport: airportTo,
        departureDate: parseDateToISO(dateFrom),
        sortByPrice: selectedSort.type,
        ticketClass: ticketClassMap[classTicket],
        minPrice: priceRange.from,
        maxPrice: priceRange.to,
        passengers: passengers,
        airline: selectedAirlines.length > 0 ? selectedAirlines : undefined,
        allowedStops: selectedTransfers,
      });
    }

    if (dateTo) {
      fetchReturnRoutes({
        fromAirport: airportTo,
        toAirport: airportFrom,
        departureDate: parseDateToISO(dateTo),
        sortByPrice: selectedSort.type,
        ticketClass: ticketClassMap[classTicket],
        minPrice: priceRange.from,
        maxPrice: priceRange.to,
        passengers: passengers,
        airline: selectedAirlines.length > 0 ? selectedAirlines : undefined,
        allowedStops: selectedTransfers,
      });
    }
  }, [
    airportFrom,
    airportTo,
    classTicket,
    dateFrom,
    dateTo,
    fetchOneWayRoutes,
    fetchReturnRoutes,
    passengers,
    priceRange.from,
    priceRange.to,
    selectedAirlines,
    selectedSort.type,
    selectedTransfers,
  ]);

  const handleCheckboxChange = (key: string) => (checked: boolean) => {
    if (key in transfersCheckboxes) {
      setTransfersCheckboxes((prev) => ({ ...prev, [key]: checked }));

      const transfersMap: Record<string, number> = {
        noTransfers: 0,
        oneTransfer: 1,
        twoTransfers: 2,
        threeTransfers: 3,
      };

      const transferCount = transfersMap[key];

      if (checked) {
        setSelectedTransfers((prev) => [...prev, transferCount]);
      } else {
        setSelectedTransfers((prev) =>
          prev.filter((count) => count !== transferCount),
        );
      }
    } else if (key in airlineCheckboxes) {
      setAirlineCheckboxes((prev) => ({ ...prev, [key]: checked }));
      
      // Находим полное название авиалинии по state
      const airline = airlines.find(a => a.state === key);
      if (airline) {
        if (checked) {
          setSelectedAirlines((prev) => [...prev, airline.name]);
        } else {
          setSelectedAirlines((prev) =>
            prev.filter((name) => name !== airline.name),
          );
        }
      }
    }
  };

  const handlePriceChange = (key: "from" | "to", value: string) => {
    setPriceRange((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSortChange = (value: any) => {
    setSelectedSort(value);
  };

  const handleClearFilters = () => {
    setTransfersCheckboxes({
      noTransfers: false,
      oneTransfer: false,
      twoTransfers: false,
      threeTransfers: false,
    });
    setSelectedTransfers([]);

    const resetAirlines = Object.keys(airlineCheckboxes).reduce(
      (acc, key) => {
        acc[key] = false;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    setAirlineCheckboxes(resetAirlines);
    setSelectedAirlines([]);
    setPriceRange({ from: "", to: "" });
    setSelectedSort({ id: "1", name: "дешевые → дорогие", type: "asc" });
  };

  const handleRemoveFilter = useCallback(
    (filter: string) => {
      const layover = layovers.find((l) => l.name === filter);
      if (layover) {
        setTransfersCheckboxes((prev) => ({ ...prev, [layover.state]: false }));
  
        const transfersMap: Record<string, number> = {
          noTransfers: 0,
          oneTransfer: 1,
          twoTransfers: 2,
          threeTransfers: 3,
        };
  
        const transferCount = transfersMap[layover.state];
        setSelectedTransfers((prev) =>
          prev.filter((count) => count !== transferCount),
        );
        return;
      }
  
      const airline = airlines.find((a) => a.name === filter);
      if (airline) {
        setAirlineCheckboxes((prev) => ({ ...prev, [airline.state]: false }));
        setSelectedAirlines((prev) =>
          prev.filter((name) => name !== airline.name),
        );
        return;
      }
  
      if (filter.startsWith("От")) {
        setPriceRange((prev) => ({ ...prev, from: "" }));
        return;
      }
      if (filter.startsWith("До")) {
        setPriceRange((prev) => ({ ...prev, to: "" }));
        return;
      }
  
      if (filter === selectedSort.name) {
        setSelectedSort({ id: "1", name: "дешевые → дорогие", type: "asc" });
        return;
      }
    },
    [airlines, selectedSort.name],
  );

  return (
    <Layout>
      <div className="flex flex-col justify-self-center gap-6">
        <div className="flex flex-row gap-6">
          <h1 className="text-3xl font-bold">Результаты поиска</h1>
          <div className="flex flex-row gap-6 pt-3 items-center">
            <div className="flex flex-row gap-2 items-center">
              <div className="flex flex-row gap-1 items-center">
                <p className="text-sm text-gray-500">{cityFrom}</p>
                <p className="text-base text-gray-400">{airportFrom}</p>
              </div>
              <Arrow className="rotate-180 w-5 h-2.5 [&>path]:stroke-gray-500" />
              <div className="flex flex-row gap-1 items-center">
                <p className="text-sm text-gray-500">{cityTo}</p>
                <p className="text-base text-gray-400">{airportTo}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">
                {passengers} {getPassengersLabel(passengers)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{classTicket}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{dateFrom}</p>
            </div>
            {dateTo ? (
              <div>
                <p className="text-sm text-gray-500">{dateTo}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500">В одну сторону</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row gap-5">
          <Filters
            layovers={layovers}
            airlines={airlines}
            transfersCheckboxes={transfersCheckboxes}
            airlineCheckboxes={airlineCheckboxes}
            priceRange={priceRange}
            selectedSort={selectedSort}
            onCheckboxChange={handleCheckboxChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
            onClearFilters={handleClearFilters}
          />
          <div className="flex flex-col gap-2 max-w-[650px]">
            <div className="flex flex-row gap-2 overflow-x-auto">
              {filtersCheap.map((filter, index) => (
                <CheapFilter
                  key={index}
                  filterTitle={filter}
                  onRemove={() => handleRemoveFilter(filter)}
                />
              ))}
            </div>
            {/* {dateTo !== ""
              ? pairedRoutes.map(({ routeThere, routeBack }, index) => (
                  <RouteCard
                    key={index}
                    routeThere={routeThere}
                    routeBack={routeBack}
                  />
                ))
              : oneWayRoutes.map((route) => (
                  <RouteCard
                    key={route.id}
                    routeThere={route}
                  />
                ))} */}
            {oneWayRoutes.map((route) => (
              <RouteCard
                key={route.id}
                routeThere={route}
                passengers={passengers}
              />
            ))}
          </div>
          <HotelsList hotels={hotels} />
        </div>
      </div>
    </Layout>
  );
}
