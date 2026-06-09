import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";

/**
 * Get current translations outside of React context.
 * Safe because useLocaleStore is a Zustand store.
 */
export const getT = () => {
  return useLocaleStore.getState().t;
};
