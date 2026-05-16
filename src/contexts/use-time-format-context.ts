import { TimeFormat } from "@/types/global.types";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "time-format";
const DEFAULT = "24-hour";

type TimeFormatStore = {
  timeFormat: TimeFormat;
  setTimeFormat: (newState: TimeFormat) => void;
};
const useTimeFormat = create<TimeFormatStore>((set) => {
  const getStoredFormat = (): TimeFormat => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored) return stored as TimeFormat;
      setStorage(STORAGE_KEY, DEFAULT);
    } catch (error) {
      console.error("Failed to access timeFormat from localStorage:", error);
    }
    return DEFAULT;
  };

  return {
    timeFormat: getStoredFormat(),
    setTimeFormat: (newState) =>
      set((state) => {
        if (state.timeFormat !== newState) {
          setStorage(STORAGE_KEY, newState);
          return { timeFormat: newState };
        }
        return state;
      }),
  };
});

export default useTimeFormat;
