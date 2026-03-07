import { Interface__Nav } from "@/constants/interfaces";
import { create } from "zustand";

type BreadcrumbsState = {
  backPath?: string;
  activeNavs: Interface__Nav[];
};

interface State_Actions {
  breadcrumbs: BreadcrumbsState;
  setBreadcrumbs: (partial: Partial<BreadcrumbsState>) => void;
}

export const useBreadcrumbs = create<State_Actions>((set) => ({
  breadcrumbs: {
    backPath: undefined,
    activeNavs: [],
  },
  setBreadcrumbs: (partial) =>
    set((state) => ({
      breadcrumbs: {
        ...state.breadcrumbs,
        ...partial,
      },
    })),
}));
