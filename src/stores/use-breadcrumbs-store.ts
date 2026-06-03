import { Nav } from "@/types/global.types";
import { create } from "zustand";

type BreadcrumbsState = {
  backPath: string | null;
  activeNavs: Nav[];
};

type BreadcrumbsStore = {
  breadcrumbs: BreadcrumbsState;
  setBreadcrumbs: (partial: Partial<BreadcrumbsState>) => void;
};

export const useBreadcrumbsStore = create<BreadcrumbsStore>((set) => ({
  breadcrumbs: {
    backPath: null,
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
