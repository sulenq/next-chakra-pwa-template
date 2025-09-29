import { create } from "zustand";

type State = {
  rt: boolean;
};

type Actions = {
  setRt: (rt: boolean | ((prev: boolean) => boolean)) => void;
};

const useRenderTrigger = create<State & Actions>((set, get) => ({
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
