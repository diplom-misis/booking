import { useQuery } from '@tanstack/react-query';

export const useCities = (fromCityId: string | undefined, toCityId: string | undefined) => {
  return useQuery({
    queryKey: ['cities', fromCityId],
    queryFn: async () => {
      const fromCity = await fetch(`/api/city?id=${fromCityId}`, {
        method: 'GET'
      }).then((res) => res.json()).then((res) => res.city.name);

      const toCity = await fetch(`/api/city?id=${toCityId}`, {
        method: 'GET'
      }).then((res) => res.json()).then((res) => res.city.name);

      return {
        fromCity, 
        toCity
      };
    },
    enabled: !!fromCityId || !!toCityId,
    staleTime: 60000,
  });
};