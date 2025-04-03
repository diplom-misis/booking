import { create } from 'zustand';
import { Airport } from '@prisma/client';

interface AirportState {
  airports: Airport[];
  setAirports: (airports: Airport[]) => void;
}

export const useAirportStore = create<AirportState>((set) => ({
  airports: [],
  setAirports: (airports) => set({ airports }),
}));
