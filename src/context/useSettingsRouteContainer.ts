import { Type__ContainerDimension } from "@/constants/types";
import { create } from "zustand";

interface State {
  containerRef: React.RefObject<HTMLDivElement> | null;
  setContainerRef: (ref: State["containerRef"]) => void;
  containerDimension: Type__ContainerDimension;
  setContainerDimension: (dim: Type__ContainerDimension) => void;
}

export const useSettingsRouteContainer = create<State>((set) => ({
  containerRef: null,
  setContainerRef: (ref) => set({ containerRef: ref }),
  containerDimension: {
    width: 0,
    height: 0,
  },
  setContainerDimension: (dim) => set({ containerDimension: dim }),
}));
