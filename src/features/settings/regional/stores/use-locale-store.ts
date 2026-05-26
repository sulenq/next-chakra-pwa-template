import { create } from "zustand";
import { persist } from "zustand/middleware";
import en from "@/locales/en";
import id from "@/locales/id";
import { LocaleKey, Translations } from "@/types/global.types";

// -----------------------------------------------------------------

const STORAGE_KEY = "locale";

const DEFAULT: keyof typeof translations = "en";

export const translations = {
  id,
  en,
};

type LocaleStore = {
  t: Translations;
  locale: LocaleKey;
  setLocale: (newState: LocaleKey) => void;
};

export const useLocaleStore = create<LocaleStore>()(
  persist(
    (set) => ({
      locale: DEFAULT,
      t: translations[DEFAULT],
      setLocale: (newState) =>
        set((state) => {
          if (state.locale !== newState) {
            return {
              locale: newState,
              t: translations[newState],
            };
          }
          return state;
        }),
    }),
    {
      name: STORAGE_KEY,
      // Only persist `locale`; `t` is derived and re-computed on rehydration
      partialize: (state) => ({ locale: state.locale }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.locale];
        }
      },
    },
  ),
);
