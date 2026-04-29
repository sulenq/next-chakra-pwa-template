import { Type__ContainerDimension } from "@/shared/constants/types";
import { create } from "zustand";

type MasterDataPageContainer = {
  containerRef: React.RefObject<HTMLDivElement> | null;
  setContainerRef: (ref: MasterDataPageContainer["containerRef"]) => void;
  containerDimension: Type__ContainerDimension;
  setContainerDimension: (dim: Type__ContainerDimension) => void;
};
export const useMasterDataPageContainer = create<MasterDataPageContainer>(
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
