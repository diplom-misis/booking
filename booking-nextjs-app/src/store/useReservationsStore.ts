import { fetchReservations } from "@/services/reservationsService";
import { Reservation } from "@prisma/client";
import { create } from "zustand";

type ReservationsState = {
  reservations: Reservation[];
  isLoading: boolean;
  setReservations: (reservations: Reservation[]) => void;
};

export const useReservationsStore = create<ReservationsState>((set) => ({
  reservations: [],
  isLoading: false,
  setReservations: async (reservations) => {
    set({ isLoading: true });
    try {
      set({ reservations, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },
}));
