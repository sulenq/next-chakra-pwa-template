import { create } from "zustand";

type OfflineStore = {
  offline: boolean;
  setOffline: (newState: any) => void;
};
const useOffline = create<OfflineStore>((set) => {
  return {
    offline: false,
    setOffline: (newState: any) => set({ offline: newState }),
  };
});

export default useOffline;
