import { create } from "zustand";

interface Props {
  loadingBar: boolean;
  setLoadingBar: (newState: boolean) => void;
}

export const useLoadingBar = create<Props>((set) => ({
  loadingBar: false,
  setLoadingBar: (newState) => set({ loadingBar: newState }),
}));
