import { create } from "zustand";

interface Props {
  rt2: boolean;
  setRt2: (rt2: boolean | ((prev: boolean) => boolean)) => void;
}

const useRenderTrigger = create<Props>((set, get) => ({
  rt2: false,
  setRt2: (rt2) => {
    if (typeof rt2 === "function") {
      set({ rt2: rt2(get().rt2) });
    } else {
      set({ rt2 });
    }
  },
}));

export default useRenderTrigger;
