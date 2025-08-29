import { SM_SCREEN_W_NUMBER } from "@/constants/sizes";
import useScreen from "./useScreen";

const useIsSmScreenWidth = () => {
  const { sw } = useScreen();

  return sw < SM_SCREEN_W_NUMBER;
};

export default useIsSmScreenWidth;
