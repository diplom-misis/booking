// import { create } from 'zustand';
// import { Airport } from '@prisma/client';

// interface AirportState {
//   airports: Airport[];
//   setAirports: (airports: Airport[]) => void;
// }

// export const useAirportStore = create<AirportState>((set) => ({
//   airports: [],
//   setAirports: (airports) => set({ airports }),
// }));

import { create } from "zustand";
import { Airport } from "@prisma/client";
import { fetchAirportsByCityId } from "@/services/airportService";

interface AirportState {
  airportsFrom: Airport[];
  airportsTo: Airport[];
  isLoading: boolean;
  error: string | null;
  loadAirportsFrom: (cityId: string) => Promise<void>;
  loadAirportsTo: (cityId: string) => Promise<void>;
}

export const useAirportStore = create<AirportState>((set) => ({
  airportsFrom: [],
  airportsTo: [],
  isLoading: false,
  error: null,
  loadAirportsFrom: async (cityId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchAirportsByCityId(cityId);
      set({ airportsFrom: data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load airports", isLoading: false });
    }
  },
  loadAirportsTo: async (cityId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchAirportsByCityId(cityId);
      set({ airportsTo: data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load airports", isLoading: false });
    }
  },
}));
