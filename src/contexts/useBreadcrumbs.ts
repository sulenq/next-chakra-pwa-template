import { Interface__Nav } from "@/shared/constants/interfaces";
import { create } from "zustand";

type BreadcrumbsState = {
  backPath?: string;
  activeNavs: Interface__Nav[];
};
interface BreadcrumbsStore {
  breadcrumbs: BreadcrumbsState;
  setBreadcrumbs: (partial: Partial<BreadcrumbsState>) => void;
}
export const useBreadcrumbs = create<BreadcrumbsStore>((set) => ({
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
