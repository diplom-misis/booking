import { useQuery } from "@tanstack/react-query";

export const useRoutePrices = (
  fromAirport: string | null,
  toAirport: string | null,
  year: number | null,
  month: number | null,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["routePrices", fromAirport, toAirport, year, month],
    queryFn: async () => {
      if (!fromAirport || !toAirport || !year || !month) {
        return [];
      }
      
      const response = await fetch(
        `/api/route-prices?fromAirport=${fromAirport}&toAirport=${toAirport}&year=${year}&month=${month}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }
      
      return response.json();
    },
    enabled: enabled && !!fromAirport && !!toAirport && !!year && !!month,
    staleTime: 60 * 60 * 1000,
  });
};