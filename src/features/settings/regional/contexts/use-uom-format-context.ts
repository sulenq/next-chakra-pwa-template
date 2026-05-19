import { UnitKey } from "@/types/global.types";
import { UnitOption, UNIT_OPTIONS } from "@/constants/unit-options";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "uom";

const getUnitOption = (unitKey: UnitKey, keyString: string): UnitOption => {
  return (
    UNIT_OPTIONS[unitKey].find((o) => o.key === keyString) || {
      key: keyString,
      label: keyString,
    }
  );
};

// Default metric units
export const DEFAULT_UOM: Record<UnitKey, UnitOption> = {
  mass: getUnitOption("mass", "kg"),
  length: getUnitOption("length", "m"),
  distance: getUnitOption("distance", "km"),
  height: getUnitOption("height", "cm"),
  area: getUnitOption("area", "m²"),
  volume: getUnitOption("volume", "t"),
  temperature: getUnitOption("temperature", "°C"),
  speed: getUnitOption("speed", "km/h"),
  energy: getUnitOption("energy", "kWh"),
  power: getUnitOption("power", "W"),
  pressure: getUnitOption("pressure", "kPa"),
  data: getUnitOption("data", "MB"),
  dataRate: getUnitOption("dataRate", "Mbps"),
  angle: getUnitOption("angle", "°"),
};

type UOMFormatStore = {
  UOM: Record<UnitKey, UnitOption>;
  setUOM: (newState: Record<UnitKey, UnitOption>) => void;
  setUOMUnit: (key: UnitKey, value: UnitOption) => void;
};

const useUOMFormat = create<UOMFormatStore>((set) => {
  const getStoredUOM = (): Record<UnitKey, UnitOption> => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<UnitKey, any>;
        // Upgrade legacy string values to UnitOption objects
        const upgraded: any = {};
        for (const [k, v] of Object.entries(parsed)) {
          if (typeof v === "string") {
            upgraded[k as UnitKey] = getUnitOption(k as UnitKey, v);
          } else {
            upgraded[k as UnitKey] = v;
          }
        }
        return upgraded as Record<UnitKey, UnitOption>;
      }
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
