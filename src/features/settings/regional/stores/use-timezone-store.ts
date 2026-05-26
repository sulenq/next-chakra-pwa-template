import { TimezoneValue } from "@/types/global.types";
import { cleanTimezoneValue, getLocalTimezone } from "@/utils/time";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// -----------------------------------------------------------------

const STORAGE_KEY = "timezone";

interface TimezoneStore {
  timezone: TimezoneValue;
  isAuto: boolean;
  setTimezone: (value: TimezoneValue) => void;
  enableAuto: () => void;
  disableAuto: (value: TimezoneValue) => void;
}

const useTimezoneStore = create<TimezoneStore>()(
  persist(
    (set) => ({
      timezone: getLocalTimezone(),
      isAuto: true,

      setTimezone: (value) => {
        const cleanedValue = cleanTimezoneValue(value);
        set({ timezone: cleanedValue, isAuto: false });
      },

      enableAuto: () => {
        set({ timezone: getLocalTimezone(), isAuto: true });
      },

      disableAuto: (value) => {
        const cleanedValue = cleanTimezoneValue(value);
        set({ timezone: cleanedValue, isAuto: false });
      },
    }),
    { name: STORAGE_KEY },
  ),
);

export default useTimezoneStore;
