import { useColorMode } from "@/components/ui/color-mode";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { getBodyColor } from "@/shared/utils/color";

export const useColorBody = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();

  const bg = getBodyColor(themeConfig.colorPalette, colorMode);

  return bg;
};
