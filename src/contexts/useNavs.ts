import { create } from "zustand";
import { getStorage, setStorage } from "@/utils/client";

interface Props {
  isNavsExpanded: boolean;
  setNavsExpanded: (newState: boolean | ((prev: boolean) => boolean)) => void;
  toggleNavsExpanded: () => void;
}

const STORAGE_KEY = "isNavsExpanded";

const initialValue =
  getStorage(STORAGE_KEY) === null ? true : getStorage(STORAGE_KEY) === "true";

const useNavs = create<Props>((set, get) => {
  return {
    isNavsExpanded: initialValue,
    setNavsExpanded: (newState) => {
      const value =
        typeof newState === "function"
          ? newState(get().isNavsExpanded)
          : newState;

      setStorage(STORAGE_KEY, String(value));
      set({ isNavsExpanded: value });
    },
    toggleNavsExpanded: () => {
      const next = !get().isNavsExpanded;
      setStorage(STORAGE_KEY, String(next));
      set({ isNavsExpanded: next });
    },
  };
});

export default useNavs;
