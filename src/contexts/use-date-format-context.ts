import { DateFormat } from "@/types/global.types";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "date-format";
const DEFAULT = "dmy";

interface DateFormatStore {
  dateFormat: DateFormat;
  setDateFormat: (newState: DateFormat) => void;
}
const useDateFormat = create<DateFormatStore>((set) => {
  const getStoredFormat = (): DateFormat => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored) return stored as DateFormat;
      setStorage(STORAGE_KEY, DEFAULT);
    } catch (error) {
      console.error("Failed to access dateFormat from localStorage:", error);
    }
    return DEFAULT;
  };

  return {
    dateFormat: getStoredFormat(),
    setDateFormat: (newState) =>
      set((state) => {
        if (state.dateFormat !== newState) {
          setStorage(STORAGE_KEY, newState);
          return { dateFormat: newState };
        }
        return state;
      }),
  };
});

export default useDateFormat;
