import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";

/**
 * Get current translations outside of React context.
 * Safe because useLocaleContext is a Zustand store.
 */
export const getT = () => {
  return useLocaleContext.getState().t;
};
