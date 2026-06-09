import { UnitKey } from "@/types/global.types";
import { UnitOption, UNIT_OPTIONS } from "@/constants/unit-options";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// -----------------------------------------------------------------

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

const useUOMFormatStore = create<UOMFormatStore>()(
  persist(
    (set) => ({
      UOM: DEFAULT_UOM,

      setUOM: (newState) => {
        set({ UOM: newState });
      },

      setUOMUnit: (key, value) =>
        set((state) => ({
          UOM: { ...state.UOM, [key]: value },
        })),
    }),
    {
      name: STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (!state?.UOM) return;
        // Upgrade legacy string values to UnitOption objects
        const upgraded: Record<string, UnitOption> = {};
        for (const [k, v] of Object.entries(state.UOM)) {
          upgraded[k] =
            typeof v === "string"
              ? getUnitOption(k as UnitKey, v as string)
              : (v as UnitOption);
        }
        state.UOM = upgraded as Record<UnitKey, UnitOption>;
      },
    },
  ),
);

export default useUOMFormatStore;
