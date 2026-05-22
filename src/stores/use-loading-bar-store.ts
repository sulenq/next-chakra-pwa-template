import { create } from "zustand";

type LoadingBarStore = {
  loadingBar: boolean;
  setLoadingBar: (newState: boolean) => void;
};

export const useLoadingBarStore = create<LoadingBarStore>((set) => ({
  loadingBar: false,
  setLoadingBar: (newState) => set({ loadingBar: newState }),
}));
