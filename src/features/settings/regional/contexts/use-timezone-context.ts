import { TimezoneValue } from "@/types/global.types";
import { getStorage, removeStorage, setStorage } from "@/utils/client";
import { cleanTimezoneValue, getLocalTimezone } from "@/utils/time";
import { create } from "zustand";

const STORAGE_KEY = "timezone";

interface TimezoneStore {
  timezone: TimezoneValue;
  isAuto: boolean;
  setTimezone: (value: TimezoneValue) => void;
  enableAuto: () => void;
  disableAuto: (value: TimezoneValue) => void;
}

const useTimezone = create<TimezoneStore>((set) => {
  const getInitialTimezone = (): TimezoneValue => {
    try {
      const raw = getStorage(STORAGE_KEY);
      if (!raw) return getLocalTimezone();

      const parsed = JSON.parse(raw) as TimezoneValue;
      return parsed;
    } catch {
      return getLocalTimezone();
    }
  };

  const initialIsAuto = !getStorage(STORAGE_KEY);

  return {
    timezone: getInitialTimezone(),
    isAuto: initialIsAuto,

    setTimezone: (value) => {
      const cleanedValue = cleanTimezoneValue(value);
      setStorage(STORAGE_KEY, JSON.stringify(cleanedValue));

      set({
        timezone: cleanedValue,
        isAuto: false,
      });
    },

    enableAuto: () => {
      removeStorage(STORAGE_KEY);

      set({
        timezone: getLocalTimezone(),
        isAuto: true,
      });
    },

    disableAuto: (value) => {
      const cleanedValue = cleanTimezoneValue(value);
      setStorage(STORAGE_KEY, JSON.stringify(cleanedValue));

      set({
        timezone: cleanedValue,
        isAuto: false,
      });
    },
  };
});

export default useTimezone;
