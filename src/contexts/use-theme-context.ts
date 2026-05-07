import { COLOR_PALETTES } from "@/constants/colors";
import { IMAGES_PATH } from "@/constants/paths";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

interface ThemeContext {
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

const LOCAL_STORAGE_KEY = "theme-config";

export const DEFAULT: ThemeContext = {
  colorPalette: COLOR_PALETTES[0].palette,
  primaryColor: `${COLOR_PALETTES[0].palette}.solid`,
  primaryColorHex: COLOR_PALETTES[0].primaryHex,
  logo: `${IMAGES_PATH}/logo_graphic.png`,
  radii: ROUNDED_PRESETS[6],
};

type ThemeConfigStore = {
  themeContext: ThemeContext;
  setThemeContext: (
    config:
      | Partial<ThemeContext>
      | ((prev: ThemeContext) => Partial<ThemeContext>),
  ) => void;
};
export const useThemeContext = create<ThemeConfigStore>((set) => {
  const stored = getStorage(LOCAL_STORAGE_KEY);
  const initial = stored ? JSON.parse(stored) : DEFAULT;

  return {
    themeContext: initial,
    setThemeContext: (config) => {
      set((state) => {
        const update =
          typeof config === "function" ? config(state.themeContext) : config;

        const newConfig = { ...state.themeContext, ...update };
        setStorage(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));

        return { themeContext: newConfig };
      });
    },
  };
});
