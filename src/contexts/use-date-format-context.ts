import { SelectOption } from "@/types/global.types";
import { DATE_FORMATS } from "@/constants/date-formats";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "date-format";
const DEFAULT: SelectOption = {
  id: "dmy",
  label: DATE_FORMATS.find((f) => f.key === "dmy")?.label,
  data: "dmy",
};

interface DateFormatStore {
  dateFormat: SelectOption;
  setDateFormat: (newState: SelectOption) => void;
}
const useDateFormat = create<DateFormatStore>((set) => {
  const getStoredFormat = (): SelectOption => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as SelectOption;
        } catch {
          // fallback for older string values
          return {
            id: stored,
            label: DATE_FORMATS.find((f) => f.key === stored)?.label,
            data: stored,
          };
        }
      }
      setStorage(STORAGE_KEY, JSON.stringify(DEFAULT));
    } catch (error) {
      console.error("Failed to access dateFormat from localStorage:", error);
    }
    return DEFAULT;
  };

  return {
    dateFormat: getStoredFormat(),
    setDateFormat: (newState) =>
      set((state) => {
        if (state.dateFormat.id !== newState.id) {
          setStorage(STORAGE_KEY, JSON.stringify(newState));
          return { dateFormat: newState };
        }
        return state;
      }),
  };
});

export default useDateFormat;
