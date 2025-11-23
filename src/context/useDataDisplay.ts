import { create } from "zustand";
import { persist } from "zustand/middleware";

type DataDisplay = "table" | "grid";

const STORAGE_KEY = "dataDisplay";

interface DataDisplayState {
  displays: Record<string, DataDisplay>;
  setDisplay: (key: string, mode: DataDisplay) => void;
  getDisplay: (key: string) => DataDisplay;
}

export const useDataDisplay = create<DataDisplayState>()(
  persist(
    (set, get) => ({
      displays: {},
      setDisplay: (key, mode) =>
        set((state) => ({
          displays: {
            ...state.displays,
            [key]: mode,
          },
        })),
      getDisplay: (key) => {
        const state = get();
        return state.displays[key] || "table"; // default to table
      },
    }),
    {
      name: STORAGE_KEY,
    }
  )
);
