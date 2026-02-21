import { zeroBasedWeekdayNamesFromLang } from "@/constants/weekdays";
import useLang from "@/context/useLang";

export const useZeroBasedWeekdayNames = () => {
  const l = useLang((s) => s.l);
  return zeroBasedWeekdayNamesFromLang(l);
};
