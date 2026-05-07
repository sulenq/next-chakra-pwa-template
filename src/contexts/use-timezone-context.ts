import { TimezoneValue } from "@/types/global.types";
import { getStorage, setStorage } from "@/utils/client";
import { getLocalTimezone } from "@/utils/time";
import { create } from "zustand";

const STORAGE_KEY = "timezone";

type TimezoneStore = {
  timeZone: TimezoneValue;
  setTimeZone: (newState: TimezoneValue) => void;
};
const useTimezone = create<TimezoneStore>((set) => {
  const getStoredTimeZone = (): TimezoneValue => {
    try {
      const rawStored = getStorage(STORAGE_KEY);
      if (rawStored) {
        const parsed = JSON.parse(rawStored) as TimezoneValue;
        return parsed.label.startsWith("Auto") ? getLocalTimezone() : parsed;
      }
    } catch (error) {
      console.error("Failed to parse timezone from localStorage:", error);
    }
    return getLocalTimezone();
  };

  return {
    timeZone: getStoredTimeZone(),
    setTimeZone: (newState) => {
      set((state) => {
        if (state.timeZone.key !== newState.key) {
          setStorage(STORAGE_KEY, JSON.stringify(newState));
          return { timeZone: newState };
        }
        return state;
      });
    },
  };
});

export default useTimezone;
