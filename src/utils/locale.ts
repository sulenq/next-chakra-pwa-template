import { useLocale } from "@/contexts/use-locale-context";

/**
 * Get current translations outside of React context.
 * Safe because useLocale is a Zustand store.
 */
export const getT = () => {
  return useLocale.getState().t;
};
