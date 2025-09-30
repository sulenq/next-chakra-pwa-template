import { create } from "zustand";

interface Props {
  rt: boolean;
  setRt: (rt: boolean | ((prev: boolean) => boolean)) => void;
}

const useRenderTrigger = create<Props>((set, get) => ({
  rt: false,
  setRt: (rt) => {
    if (typeof rt === "function") {
      set({ rt: rt(get().rt) });
    } else {
      set({ rt });
    }
  },
}));

export default useRenderTrigger;
