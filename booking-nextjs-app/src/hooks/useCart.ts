import { fetchCart } from '@/services/cartService';
import { useCartStore } from '@/store/useCartStore';
import { useQuery } from '@tanstack/react-query';

export const useCart = () => {
  const { setCart } = useCartStore();

  return useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await fetchCart();
      setCart(cart.routeId);
      return cart;
    },
    staleTime: 60000,
  });
};
