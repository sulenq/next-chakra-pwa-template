import { SM_SCREEN_W_NUMBER } from "@/constants/styles";
import { useScreen } from "@/hooks/useScreen";

// -----------------------------------------------------------------

export const useIsSmScreenWidth = () => {
  // Hooks
  const { sw } = useScreen();

  return sw < SM_SCREEN_W_NUMBER;
};
