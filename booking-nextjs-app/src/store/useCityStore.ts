import { create } from 'zustand';
import { City } from '@prisma/client';

interface CityState {
  cities: City[];
  setCities: (cities: City[]) => void;
}

export const useCityStore = create<CityState>((set) => ({
  cities: [],
  setCities: (cities) => set({ cities }),
}));