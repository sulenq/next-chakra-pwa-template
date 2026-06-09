import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "constrained-container";

interface ConstrainedContainerData {
  isActive: boolean;
  maxW: string;
}

interface ConstrainedContainerStore {
  constrainedContainer: ConstrainedContainerData;
  setConstrainedContainer: (value: Partial<ConstrainedContainerData>) => void;
}

const DEFAULT_VALUES: ConstrainedContainerData = {
  isActive: true,
  maxW: "1280px",
};

export const useConstrainedContainerStore = create<ConstrainedContainerStore>()(
  persist(
    (set) => ({
      constrainedContainer: DEFAULT_VALUES,

      setConstrainedContainer: (value) =>
        set((state) => ({
          constrainedContainer: {
            ...state.constrainedContainer,
            ...value,
          },
        })),

      resetConstrainedContainer: {
        ConstrainedContainer: DEFAULT_VALUES,
      },
    }),
    {
      name: STORAGE_KEY,
    },
  ),
);
