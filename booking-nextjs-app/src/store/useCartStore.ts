import { create } from 'zustand';

type CartState = {
  cart: {
    routeId: string | undefined;
  } | null;
  setCart: (routeId: string) => void;
  resetCart: () => void;
};

export const useCartStore = create<CartState>((set) => ({
  cart: null,
  setCart: (routeId) => 
    set({
      cart: {
        routeId,
      },
    }),
  resetCart: () => set({ cart: null }),
}));
