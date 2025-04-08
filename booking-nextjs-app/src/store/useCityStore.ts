import { create } from "zustand";
import { City } from "@prisma/client";

interface CityState {
  fromCities: City[];
  toCities: City[];
  isLoading: boolean;
  error: string | null;
  searchFromCities: (query: string) => Promise<void>;
  searchToCities: (query: string) => Promise<void>;
  setFromCities: (cities: City[]) => void;
  setToCities: (cities: City[]) => void;
}

export const useCityStore = create<CityState>((set) => ({
  fromCities: [],
  toCities: [],
  isLoading: false,
  error: null,
  
  searchFromCities: async (query: string) => {
    if (!query.trim()) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/airport?type=city&search=${encodeURIComponent(query)}`);
      const data = await response.json();
      set({ fromCities: data.cities || [], isLoading: false });
    } catch (err) {
      set({ error: "Failed to search cities", isLoading: false });
    }
  },
  
  searchToCities: async (query: string) => {
    if (!query.trim()) return;
    
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/airport?type=city&search=${encodeURIComponent(query)}`);
      const data = await response.json();
      set({ toCities: data.cities || [], isLoading: false });
    } catch (err) {
      set({ error: "Failed to search cities", isLoading: false });
    }
  },
  
  setFromCities: (cities) => set({ fromCities: cities }),
  setToCities: (cities) => set({ toCities: cities }),
}));