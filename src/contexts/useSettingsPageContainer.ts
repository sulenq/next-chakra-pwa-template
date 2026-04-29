import { Type__ContainerDimension } from "@/constants/types";
import { create } from "zustand";

type SettingsPageContainer = {
  containerRef: React.RefObject<HTMLDivElement> | null;
  setContainerRef: (ref: SettingsPageContainer["containerRef"]) => void;
  containerDimension: Type__ContainerDimension;
  setContainerDimension: (dim: Type__ContainerDimension) => void;
};
export const useSettingsPageContainer = create<SettingsPageContainer>(
  (set) => ({
    containerRef: null,
    setContainerRef: (ref) => set({ containerRef: ref }),
    containerDimension: {
      width: 0,
      height: 0,
    },
    setContainerDimension: (dim) => set({ containerDimension: dim }),
  }),
);
