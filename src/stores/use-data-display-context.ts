import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "data-display";

type DataDisplayMode = "table" | "grid";

interface DataDisplayStore {
  displays: Record<string, DataDisplayMode>;
  setDisplay: (key: string, mode: DataDisplayMode) => void;
  getDisplay: (key: string) => DataDisplayMode;
}

export const useDataDisplay = create<DataDisplayStore>()(
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
    },
  ),
);
