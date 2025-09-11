import { create } from "zustand";

interface State {
  containerRef: React.RefObject<HTMLDivElement | null> | null;
  setContainerRef: (ref: State["containerRef"]) => void;
}

export const useSettingsRouteContainer = create<State>((set) => ({
  containerRef: null,
  setContainerRef: (ref) => set({ containerRef: ref }),
}));
