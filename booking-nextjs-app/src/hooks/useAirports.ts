import { useQuery } from '@tanstack/react-query';
import { fetchAirportsByCityId } from '@/services/airportService';
import { useAirportStore } from '@/store/useAirportStore';

export const useAirports = (cityId?: string) => {
  const { setAirports } = useAirportStore();

  return useQuery({
    queryKey: ['airports', cityId],
    queryFn: async () => {
      if (!cityId) return [];
      const data = await fetchAirportsByCityId(cityId);
      setAirports(data); // Сохраняем в Zustand
      return data;
    },
    enabled: !!cityId,
    staleTime: 60000,
  });
};