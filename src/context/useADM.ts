import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "adm";
const DEFAULT = "false";

interface Props {
  ADM: string;
  setADM: (newState: string) => void;
}

const useADM = create<Props>((set) => {
  const stored = getStorage(STORAGE_KEY);
  if (!stored) setStorage(STORAGE_KEY, DEFAULT);
  const initial = stored ? stored : DEFAULT;

  return {
    ADM: initial,
    setADM: (newState) =>
      set(() => {
        setStorage(STORAGE_KEY, newState);
        return {
          ADM: newState,
        };
      }),
  };
});

export default useADM;
