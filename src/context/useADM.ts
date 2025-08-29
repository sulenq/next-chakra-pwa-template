import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "adm";
const DEFAULT = false;

interface Props {
  ADM: boolean;
  setADM: (newState: boolean) => void;
}

const useADM = create<Props>((set) => {
  const stored = getStorage(STORAGE_KEY);
  const initial = stored === null ? DEFAULT : stored === "true";

  if (stored === null) setStorage(STORAGE_KEY, DEFAULT ? "true" : "false");

  return {
    ADM: initial,
    setADM: (newState: boolean) =>
      set(() => {
        setStorage(STORAGE_KEY, newState ? "true" : "false");
        return { ADM: newState };
      }),
  };
});

export default useADM;
