import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export const useMobileStore = create((set) => ({
  isMobile: false,
  setIsMobile: (value) => set({ isMobile: value }),
}));
