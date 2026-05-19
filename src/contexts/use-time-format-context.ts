import { SelectOption } from "@/types/global.types";
import { TIME_FORMATS } from "@/constants/time-formats";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "time-format";
const DEFAULT: SelectOption = {
  id: "24-hour",
  label: TIME_FORMATS.find((f) => f.key === "24-hour")?.label,
  data: "24-hour",
};

type TimeFormatStore = {
  timeFormat: SelectOption;
  setTimeFormat: (newState: SelectOption) => void;
};
const useTimeFormat = create<TimeFormatStore>((set) => {
  const getStoredFormat = (): SelectOption => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored) {
        try {
          return JSON.parse(stored) as SelectOption;
        } catch {
          return {
            id: stored,
            label: TIME_FORMATS.find((f) => f.key === stored)?.label,
            data: stored,
          };
        }
      }
      setStorage(STORAGE_KEY, JSON.stringify(DEFAULT));
    } catch (error) {
      console.error("Failed to access timeFormat from localStorage:", error);
    }
    return DEFAULT;
  };

  return {
    timeFormat: getStoredFormat(),
    setTimeFormat: (newState) =>
      set((state) => {
        if (state.timeFormat.id !== newState.id) {
          setStorage(STORAGE_KEY, JSON.stringify(newState));
          return { timeFormat: newState };
        }
        return state;
      }),
  };
});

export default useTimeFormat;
