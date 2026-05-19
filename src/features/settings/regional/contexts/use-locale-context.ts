import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";
import en from "@/locales/en";
import id from "@/locales/id";
import { LocaleKey, Translations } from "@/types/global.types";

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
export const useLocaleContext = create<LocaleStore>((set) => {
  const getStoredLang = (): LocaleKey => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored && stored in translations) return stored as LocaleKey;
      setStorage(STORAGE_KEY, DEFAULT);
    } catch (error) {
      console.error("Failed to access language from local storage:", error);
    }
    return DEFAULT;
  };

  const locale = getStoredLang();

  return {
    locale: locale,
    t: translations[locale],
    setLocale: (newState) =>
      set((state) => {
        if (state.locale !== newState) {
          setStorage(STORAGE_KEY, newState);
          return {
            locale: newState,
            t: translations[newState],
          };
        }
        return state;
      }),
  };
});
