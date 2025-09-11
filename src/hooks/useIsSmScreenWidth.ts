import { SM_SCREEN_W_NUMBER } from "@/constants/sizes";
import useScreen from "./useScreen";

export const useIsSmScreenWidth = () => {
  const { sw } = useScreen();

  return sw < SM_SCREEN_W_NUMBER;
};
