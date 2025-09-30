import { create } from "zustand";
import { getStorage, setStorage } from "@/utils/client";

interface Props {
  navsExpanded: boolean;
  setNavsExpanded: (newState: boolean | ((prev: boolean) => boolean)) => void;
  toggleNavsExpanded: () => void;
}

const STORAGE_KEY = "navsExpanded";

const initialValue =
  getStorage(STORAGE_KEY) === null ? true : getStorage(STORAGE_KEY) === "true";

const useNavs = create<Props>((set, get) => {
  return {
    navsExpanded: initialValue,
    setNavsExpanded: (newState) => {
      const value =
        typeof newState === "function"
          ? newState(get().navsExpanded)
          : newState;

      setStorage(STORAGE_KEY, String(value));
      set({ navsExpanded: value });
    },
    toggleNavsExpanded: () => {
      const next = !get().navsExpanded;
      setStorage(STORAGE_KEY, String(next));
      set({ navsExpanded: next });
    },
  };
});

export default useNavs;
