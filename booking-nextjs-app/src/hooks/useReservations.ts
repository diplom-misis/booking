import { useQuery } from '@tanstack/react-query';
import { useReservationsStore } from '@/store/useReservationsStore';
import { fetchReservations } from '@/services/reservationsService';

export const useReservations = () => {
  const { setReservations } = useReservationsStore();

  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const data = await fetchReservations();
      setReservations(data);
      return data;
    },
    staleTime: 60000,
  });
};