import { create } from "zustand";

type RenderTrigger3 = {
  rt3: boolean;
  setRt3: (rt3: boolean | ((prev: boolean) => boolean)) => void;
};
const useRenderTrigger = create<RenderTrigger3>((set, get) => ({
  rt3: false,
  setRt3: (rt3) => {
    if (typeof rt3 === "function") {
      set({ rt3: rt3(get().rt3) });
    } else {
      set({ rt3 });
    }
  },
}));

export default useRenderTrigger;
