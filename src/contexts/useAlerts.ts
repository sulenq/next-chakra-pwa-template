import { create } from "zustand";

interface AlertsState {
  alerts: Record<string, boolean>;
  initAlert: (key: string) => void;
  showAlert: (key: string) => void;
  hideAlert: (key: string) => void;
}

export const useAlerts = create<AlertsState>((set) => ({
  alerts: {},

  initAlert: (key: string) => {
    const hide = localStorage.getItem(key);
    set((state) => ({
      alerts: { ...state.alerts, [key]: hide !== "true" },
    }));
  },

  showAlert: (key: string) => {
    set((state) => ({
      alerts: { ...state.alerts, [key]: true },
    }));
  },

  hideAlert: (key: string) => {
    localStorage.setItem(key, "true");
    set((state) => ({
      alerts: { ...state.alerts, [key]: false },
    }));
  },
}));
