import { create } from "zustand";

// TODO убедиться, что не используется и удалить.

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageLink: string;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  setUserImage: (imageLink: string) => void;
  clearUser: () => void;
  updateUser: (partialUser: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  setUserImage: (imageLink) =>
    set((state) => {
      if (!state.user) {
        console.warn("Cannot update image - no user is set");
        return {};
      }
      return { user: { ...state.user, imageLink } };
    }),
  clearUser: () => set({ user: null }),
  updateUser: (partialUser) =>
    set((state) => {
      if (!state.user) {
        console.warn("Cannot update - no user is set");
        return {};
      }
      return { user: { ...state.user, ...partialUser } };
    }),
}));
