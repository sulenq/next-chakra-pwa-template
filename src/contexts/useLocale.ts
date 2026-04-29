import { getStorage, setStorage } from "@/shared/utils/client";
import { create } from "zustand";
import en from "@/locales/en";
import id from "@/locales/id";

const STORAGE_KEY = "locale";
const DEFAULT: keyof typeof translations = "en";

export const translations = {
  id,
  en,
};

type LocaleStore = {
  t: (typeof translations)[keyof typeof translations];
  locale: keyof typeof translations;
  setLocale: (newState: keyof typeof translations) => void;
};
export const useLocale = create<LocaleStore>((set) => {
  const getStoredLang = (): keyof typeof translations => {
    try {
      const stored = getStorage(STORAGE_KEY);
      if (stored && stored in translations)
        return stored as keyof typeof translations;
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
