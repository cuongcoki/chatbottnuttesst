// utility/stores/sessionStore.ts
import { create } from "zustand";

interface SessionState {
  isSessionExpired: boolean;
  showSessionExpiredDialog: () => void;
  hideSessionExpiredDialog: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
  isSessionExpired: false,

  showSessionExpiredDialog: () => {
    set({ isSessionExpired: true });
  },

  hideSessionExpiredDialog: () => {
    set({ isSessionExpired: false });
  },
}));