import { useQuery } from '@tanstack/react-query';
import { fetchCities } from '@/services/cityService';
import { useCityStore } from '@/store/useCityStore';

export const useCities = () => {
  const { setCities } = useCityStore();

  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const data = await fetchCities();
      setCities(data);
      return data;
    },
    staleTime: 60000,
  });
};