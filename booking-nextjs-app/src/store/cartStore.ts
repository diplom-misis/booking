import { create } from "zustand";
import axios from "axios";
import { RouteDto } from "@/types/SearchResult";

interface CartItem {
  id: string;
  routeId: string;
  passengers: number;
  route: RouteDto;
}

interface CartState {
  items: CartItem[];
  addToCart: (route: RouteDto, passengers: number) => Promise<void>;
  removeFromCart: (routeId: string) => Promise<void>;
  isInCart: (routeId: string) => boolean;
  getCart: () => any;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: async (route, passengers) => {
    try {
      const { data } = await axios.post("/api/cart", {
        routeId: route.id,
        passengersCount: passengers,
      });

      set((state) => ({
        items: [
          ...state.items,
          ...data.items.map((item: any) => ({
            id: item.id,
            routeId: item.routeId,
            passengers,
            route,
          })),
        ],
      }));
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  removeFromCart: async (routeId) => {
    try {
      await axios.delete("/api/cart", { data: { routeId } });

      set((state) => ({
        items: state.items.filter((item) => item.routeId !== routeId),
      }));
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  isInCart: (routeId) => {
    return get().items.some((item) => item.routeId === routeId);
  },

  getCart: () => {
    const data = get().items[0];

    if (!data || !data.route || !data.route.flights || data.route.flights.length === 0) {
      console.warn("Корзина пуста или данные маршрута отсутствуют");
      return null;
    }

    const fromCityId = data.route.flights[0].from.cityId
    const toCityId = data.route.flights[0].to.cityId
    const fromAirport = data.route.flights[0].from.code;
    const toAirport = data.route.flights[0].to.code;
    const company = data.route.airlines[0];
    const fromDatetime = new Date(data.route.flights[0].departure);
    const toDatetime = new Date(data.route.flights[0].arrival);
    const passengersCount = data.passengers;
    const price = get().items.reduce(
      (acc, data) => acc + data.route.flights[0].price,
      0,
    );
    const ticketClass = data.route.flights[0].ticketClass;

    return {
      fromCityId,
      toCityId,
      fromAirport,
      toAirport,
      company,
      fromDatetime,
      toDatetime,
      passengersCount,
      price,
      ticketClass,
    };
  },
}));
