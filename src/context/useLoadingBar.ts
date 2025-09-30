import { create } from "zustand";

interface Props {
  loading: boolean;
  setLoading: (newState: boolean) => void;
}

export const useLoadingBar = create<Props>((set) => ({
  loading: false,
  setLoading: (newState) => set({ loading: newState }),
}));
