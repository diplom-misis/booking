// import { create } from 'zustand';
// import { City } from '@prisma/client';

// interface CityState {
//   cities: City[];
//   setCities: (cities: City[]) => void;
// }

// export const useCityStore = create<CityState>((set) => ({
//   cities: [],
//   setCities: (cities) => set({ cities }),
// }));

import { create } from "zustand";
import { City } from "@prisma/client";
import { fetchCities } from "@/services/cityService";

interface CityState {
  cities: City[];
  isLoading: boolean;
  error: string | null;
  loadCities: () => Promise<void>;
  setCities: (cities: City[]) => void;
}

export const useCityStore = create<CityState>((set) => ({
  cities: [],
  isLoading: false,
  error: null,
  loadCities: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await fetchCities();
      set({ cities: data, isLoading: false });
    } catch (err) {
      set({ error: "Failed to load cities", isLoading: false });
    }
  },
  setCities: (cities) => set({ cities }),
}));
