import { SelectOption } from "@/types/global.types";
import { TIME_FORMATS } from "@/constants/time-formats";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// -----------------------------------------------------------------

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

const useTimeFormatStore = create<TimeFormatStore>()(
  persist(
    (set) => ({
      timeFormat: DEFAULT,
      setTimeFormat: (newState) =>
        set((state) => {
          if (state.timeFormat.id !== newState.id) {
            return { timeFormat: newState };
          }
          return state;
        }),
    }),
    { name: STORAGE_KEY },
  ),
);

export default useTimeFormatStore;
