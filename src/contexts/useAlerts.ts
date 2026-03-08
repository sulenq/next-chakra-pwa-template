import { create } from "zustand";

type AlertsStore = {
  alerts: Record<string, boolean>;
  showAlert: (key: string) => void;
  hideAlert: (key: string) => void;
};

export const useAlerts = create<AlertsStore>((set) => ({
  alerts: {},

  showAlert: (key: string) =>
    set((state) => ({
      alerts: {
        ...state.alerts,
        [key]: true,
      },
    })),

  hideAlert: (key: string) =>
    set((state) => ({
      alerts: {
        ...state.alerts,
        [key]: false,
      },
    })),
}));
