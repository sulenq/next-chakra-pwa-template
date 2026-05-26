import { SelectOption } from "@/types/global.types";
import { DATE_FORMATS } from "@/constants/date-formats";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// -----------------------------------------------------------------

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

const useDateFormatStore = create<DateFormatStore>()(
  persist(
    (set) => ({
      dateFormat: DEFAULT,
      setDateFormat: (newState) =>
        set((state) => {
          if (state.dateFormat.id !== newState.id) {
            return { dateFormat: newState };
          }
          return state;
        }),
    }),
    { name: STORAGE_KEY },
  ),
);

export default useDateFormatStore;
