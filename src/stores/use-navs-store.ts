import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "is-navs-expanded";

type NavsStore = {
  isNavsExpanded: boolean;
  setNavsExpanded: (newState: boolean | ((prev: boolean) => boolean)) => void;
  toggleNavsExpanded: () => void;
};

export const useNavsStore = create<NavsStore>()(
  persist(
    (set) => ({
      isNavsExpanded: true,

      setNavsExpanded: (newState) =>
        set((state) => {
          const value =
            typeof newState === "function"
              ? newState(state.isNavsExpanded)
              : newState;
          return { isNavsExpanded: value };
        }),

      toggleNavsExpanded: () =>
        set((state) => ({
          isNavsExpanded: !state.isNavsExpanded,
        })),
    }),
    {
      name: STORAGE_KEY,
    },
  ),
);
