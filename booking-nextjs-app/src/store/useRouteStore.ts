import { create } from "zustand";

interface Airport {
  id: string;
  cityId: string;
  code: string;
  name: string;
}

interface Flight {
  id: string;
  from: Airport;
  to: Airport;
  departure: string;
  arrival: string;
  company: string;
  flightNumber: string;
  ticketClass: string;
  price: number;
}

interface Layover {
  id: string
  airport: Airport
  durationMs: number
  durationString: string
  fromFlightId: string
  toFlightId: string
}

export interface RouteDto {
  id: string;
  hash: string;
  totalPrice: number;
  stops: number;
  durationString: string
  airlines: string[]
  flights: Flight[];
  layovers: Layover[]
}

interface RouteStore {
  oneWayRoutes: RouteDto[];
  returnRoutes: RouteDto[];
  isLoading: boolean;
  error: string | null;
  fetchOneWayRoutes: (params: Record<string, any>) => Promise<void>;
  fetchReturnRoutes: (params: Record<string, any>) => Promise<void>;
  reset: () => void;
}

export const useRouteStore = create<RouteStore>((set) => ({
  oneWayRoutes: [],
  returnRoutes: [],
  isLoading: false,
  error: null,

  fetchOneWayRoutes: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, v));
        } else {
          query.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/routes?${query.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch one-way routes");

      const data = await response.json();
      set({ oneWayRoutes: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch one-way routes", isLoading: false });
    }
  },

  fetchReturnRoutes: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        if (Array.isArray(value)) {
          value.forEach(v => query.append(key, v));
        } else {
          query.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/routes?${query.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch return routes");

      const data = await response.json();
      set({ returnRoutes: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch return routes", isLoading: false });
    }
  },

  reset: () => set({ 
    oneWayRoutes: [], 
    returnRoutes: [], 
    isLoading: false, 
    error: null 
  }),
}));