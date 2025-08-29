import { IMAGES_PATH } from "@/constants/paths";
import { getStorage, setStorage } from "@/utils/client";
import { create } from "zustand";

const LOCAL_STORAGE_KEY = "theme_config";

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

const DEFAULT: ThemeConfigProps = {
  colorPalette: "p",
  primaryColor: "p.500",
  primaryColorHex: "#006aff",
  logo: `${IMAGES_PATH}/logo_graphic.png`,
  radii: {
    component: "6px",
    container: "8px",
  },
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
