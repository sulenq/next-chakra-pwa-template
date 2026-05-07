import { SM_SCREEN_BREAKPOINT } from "@/constants/styles";
import { useScreen } from "@/hooks/use-screen";

// -----------------------------------------------------------------

export const useIsSmScreenWidth = () => {
  // Hooks
  const { sw } = useScreen();

  return sw < SM_SCREEN_BREAKPOINT;
};
