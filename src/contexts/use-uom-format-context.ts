import { UnitKey } from "@/types/global.types";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "uom";

// Default metric units
export const DEFAULT_UOM: Record<UnitKey, string> = {
  mass: "kg",
  length: "m",
  distance: "km",
  height: "cm",
  area: "m²",
  volume: "t",
  temperature: "°C",
  speed: "km/h",
  energy: "kWh",
  power: "W",
  pressure: "kPa",
  data: "MB",
  dataRate: "Mbps",
  angle: "°",
};

type UOMFormatStore = {
  UOM: Record<UnitKey, string>;
  setUOM: (newState: Record<UnitKey, string>) => void;
  setUOMUnit: (key: UnitKey, value: string) => void;
};

const useUOMFormat = create<UOMFormatStore>((set) => {
  const getStoredUOM = (): Record<UnitKey, string> => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored) return JSON.parse(stored) as Record<UnitKey, string>;
      setStorage(STORAGE_KEY, JSON.stringify(DEFAULT_UOM));
    } catch (error) {
      console.error("Failed to access UOM from localStorage:", error);
    }
    return DEFAULT_UOM;
  };

  return {
    UOM: getStoredUOM(),

    setUOM: (newState) => {
      setStorage(STORAGE_KEY, JSON.stringify(newState));
      set({ UOM: newState });
    },

    setUOMUnit: (key, value) =>
      set((state) => {
        const updated = { ...state.UOM, [key]: value };
        setStorage(STORAGE_KEY, JSON.stringify(updated));
        return { UOM: updated };
      }),
  };
});

export default useUOMFormat;
