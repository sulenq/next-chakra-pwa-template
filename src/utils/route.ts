import { RESOLVED_NAVS } from "@/constants/navs";
import { NavGroup, Translations } from "@/types/global.types";
import { last } from "@/utils/array";
import { pluckString } from "@/utils/string";

export const getActiveNavs = (
  pathname: string,
  privateNavs?: NavGroup[],
): NavGroup["navs"][number][] => {
  const findInList = (
    items: NavGroup["navs"],
  ): NavGroup["navs"][number][] | null => {
    for (const item of items) {
      if (item.path === pathname) return [item];
      if (item.children) {
        for (const subGroup of item.children) {
          if (subGroup.navs) {
            const found = findInList(subGroup.navs);
            if (found) return [item, ...found];
          }
        }
      }
    }
    return null;
  };

  const resolvedPrivateNavs = privateNavs || RESOLVED_NAVS;

  for (const navGroup of resolvedPrivateNavs) {
    const result = findInList(navGroup.navs);
    if (result) return result;
  }

  return [];
};

export const getMainViewTitle = (pathname: string, t: Translations) => {
  const activeNav = getActiveNavs(pathname);
  const routeTitle =
    last(activeNav)?.label || pluckString(t, last(activeNav)?.labelKey || "");

  return routeTitle;
};
