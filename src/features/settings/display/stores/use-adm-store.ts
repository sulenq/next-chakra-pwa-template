import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "adm";
const DEFAULT = false;

type ADMStore = {
  ADM: boolean;
  setADM: (newState: boolean | ((prevState: boolean) => boolean)) => void;
};

const useADMStore = create<ADMStore>((set) => {
  const stored = getStorage(STORAGE_KEY);
  const initial = stored === null ? DEFAULT : stored === "true";

  if (stored === null) setStorage(STORAGE_KEY, DEFAULT ? "true" : "false");

  return {
    ADM: initial,
    setADM: (newState: boolean | ((prevState: boolean) => boolean)) =>
      set((state) => {
        const updatedValue =
          typeof newState === "function" ? newState(state.ADM) : newState;
        setStorage(STORAGE_KEY, updatedValue ? "true" : "false");
        return { ADM: updatedValue };
      }),
  };
});

export default useADMStore;
