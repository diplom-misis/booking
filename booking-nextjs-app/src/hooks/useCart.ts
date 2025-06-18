import { fetchCart } from '@/services/cartService';
import { useQuery } from '@tanstack/react-query';

export const useCart = () => {
  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const carts = await fetchCart();
      return carts || [];
    },
    staleTime: 60000,
  });
};
