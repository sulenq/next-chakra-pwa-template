import { monthNamesFromLang } from "@/constants/months";
import useLang from "@/context/useLang";

export const useMonthNames = () => {
  const l = useLang((s) => s.l);
  return monthNamesFromLang(l);
};
