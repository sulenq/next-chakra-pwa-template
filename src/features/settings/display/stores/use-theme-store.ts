import { COLOR_PALETTES } from "@/constants/colors";
import { IMAGES_PATH } from "@/constants/paths";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const STORAGE_KEY = "theme-config";

interface ThemeStore {
  colorPalette: string;
  primaryColor: string;
  primaryColorHex: string;
  logo: string;
  radii: {
    label: string;
    component: string;
    container: string;
  };
}

export const DEFAULT: ThemeStore = {
  colorPalette: COLOR_PALETTES[0].palette,
  primaryColor: `${COLOR_PALETTES[0].palette}.solid`,
  primaryColorHex: COLOR_PALETTES[0].primaryHex,
  logo: `${IMAGES_PATH}/logo_graphic.png`,
  radii: ROUNDED_PRESETS[5],
};

type ThemeConfigStore = {
  theme: ThemeStore;
  setTheme: (
    config: Partial<ThemeStore> | ((prev: ThemeStore) => Partial<ThemeStore>),
  ) => void;
};

export const useThemeStore = create<ThemeConfigStore>((set) => {
  const stored = getStorage(STORAGE_KEY);
  const initial = stored ? JSON.parse(stored) : DEFAULT;

  return {
    theme: initial,
    setTheme: (config) => {
      set((state) => {
        const update =
          typeof config === "function" ? config(state.theme) : config;

        const newConfig = { ...state.theme, ...update };
        setStorage(STORAGE_KEY, JSON.stringify(newConfig));

        return { theme: newConfig };
      });
    },
  };
});
