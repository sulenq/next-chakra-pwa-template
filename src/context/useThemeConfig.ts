import { COLOR_PALETTES } from "@/constants/colors";
import { IMAGES_PATH } from "@/constants/paths";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

interface ThemeConfigProps {
  colorPalette: string;
  primaryColor: string;
  primaryColorHex: string;
  logo: string;
  radii: {
    component: string;
    container: string;
  };
}

const LOCAL_STORAGE_KEY = "theme_config";
export const DEFAULT: ThemeConfigProps = {
  colorPalette: COLOR_PALETTES[0].palette,
  primaryColor: `${COLOR_PALETTES[0].palette}.500`,
  primaryColorHex: COLOR_PALETTES[0].primaryHex,
  logo: `${IMAGES_PATH}/logo_graphic.png`,
  radii: ROUNDED_PRESETS[3],
};

interface Props {
  themeConfig: ThemeConfigProps;
  setThemeConfig: (config: Partial<ThemeConfigProps>) => void;
}

export const useThemeConfig = create<Props>((set) => {
  const stored = getStorage(LOCAL_STORAGE_KEY);
  const initial = stored ? JSON.parse(stored) : DEFAULT;

  return {
    themeConfig: initial,
    setThemeConfig: (config) => {
      set((state) => {
        const newConfig = { ...state.themeConfig, ...config };
        setStorage(LOCAL_STORAGE_KEY, JSON.stringify(newConfig));
        return { themeConfig: newConfig };
      });
    },
  };
});
