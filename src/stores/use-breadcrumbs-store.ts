import { Nav } from "@/types/global.types";
import { create } from "zustand";

type BreadcrumbsState = {
  backPath?: string;
  activeNavs: Nav[];
};

interface BreadcrumbsStore {
  breadcrumbs: BreadcrumbsState;
  setBreadcrumbs: (partial: Partial<BreadcrumbsState>) => void;
}

export const useBreadcrumbsStore = create<BreadcrumbsStore>((set) => ({
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
