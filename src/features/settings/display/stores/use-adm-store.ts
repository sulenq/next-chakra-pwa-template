import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "adm";
const DEFAULT = false;

type ADMStore = {
  ADM: boolean;
  setADM: (newState: boolean | ((prevState: boolean) => boolean)) => void;
};

const useADMStore = create<ADMStore>()(
  persist(
    (set) => ({
      ADM: DEFAULT,
      setADM: (newState) =>
        set((state) => ({
          ADM: typeof newState === "function" ? newState(state.ADM) : newState,
        })),
    }),
    { name: STORAGE_KEY },
  ),
);

export default useADMStore;
