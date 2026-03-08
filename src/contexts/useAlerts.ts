import { create } from "zustand";

type AlertsStore = {
  alerts: Record<string, boolean>;
  showAlert: (key: string) => void;
  hideAlert: (key: string) => void;
};
export const useAlerts = create<AlertsStore>((set) => ({
  alerts: {},

  showAlert: (key: string) =>
    set((state) => {
      const hidden = localStorage.getItem(key) === "true";

      return {
        alerts: {
          ...state.alerts,
          [key]: !hidden,
        },
      };
    }),

  hideAlert: (key: string) =>
    set((state) => {
      localStorage.setItem(key, "true");

      return {
        alerts: {
          ...state.alerts,
          [key]: false,
        },
      };
    }),
}));
