import { COLOR_PALETTES } from "@/constants/colors";
import { IMAGES_PATH } from "@/constants/paths";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

interface ThemeConfig {
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

export const DEFAULT: ThemeConfig = {
  colorPalette: COLOR_PALETTES[0].palette,
  primaryColor: `${COLOR_PALETTES[0].palette}.solid`,
  primaryColorHex: COLOR_PALETTES[0].primaryHex,
  logo: `${IMAGES_PATH}/logo_graphic.png`,
  radii: ROUNDED_PRESETS[6],
};

type ThemeConfigStore = {
  themeConfig: ThemeConfig;
  setThemeConfig: (
    config:
      | Partial<ThemeConfig>
      | ((prev: ThemeConfig) => Partial<ThemeConfig>),
  ) => void;
};
export const useThemeConfig = create<ThemeConfigStore>((set) => {
  const stored = getStorage(LOCAL_STORAGE_KEY);
  const initial = stored ? JSON.parse(stored) : DEFAULT;

  return {
    themeConfig: initial,
    setThemeConfig: (config) => {
      set((state) => {
        const update =
          typeof config === "function" ? config(state.themeConfig) : config;

        const newConfig = { ...state.themeConfig, ...update };
        setStorage(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));

        return { themeConfig: newConfig };
      });
    },
  };
});
