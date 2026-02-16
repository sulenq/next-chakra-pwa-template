import { Type__TimezoneObject } from "@/constants/types";
import { getStorage, setStorage } from "@/utils/client";
import { getLocalTimezone } from "@/utils/time";
import { create } from "zustand";

const STORAGE_KEY = "timezone";

interface Props {
  timeZone: Type__TimezoneObject;
  setTimeZone: (newState: Type__TimezoneObject) => void;
}

const useTimezone = create<Props>((set) => {
  const getStoredTimeZone = (): Type__TimezoneObject => {
    try {
      const rawStored = getStorage(STORAGE_KEY);
      if (rawStored) {
        const parsed = JSON.parse(rawStored) as Type__TimezoneObject;
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
