import { TimezoneValue } from "@/types/global.types";
import { getStorage, removeStorage, setStorage } from "@/utils/client";
import { getLocalTimezone } from "@/utils/time";
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

  const isAuto = (): boolean => {
    return getInitialTimezone()?.label?.includes("Auto");
  };

  return {
    timezone: getInitialTimezone(),
    isAuto: isAuto(),

    setTimezone: (value) => {
      setStorage(STORAGE_KEY, JSON.stringify(value));

      set({
        timezone: value,
        isAuto: false,
      });
    },

    enableAuto: () => {
      removeStorage(STORAGE_KEY);

      const local = getLocalTimezone();

      set({
        timezone: local,
        isAuto: true,
      });
    },

    disableAuto: (value) => {
      setStorage(STORAGE_KEY, JSON.stringify(value));

      set({
        timezone: value,
        isAuto: false,
      });
    },
  };
});

export default useTimezone;
