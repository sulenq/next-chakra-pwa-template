import { Interface__NavItem } from "@/constants/interfaces";
import { NAVS, OTHER_NAVS, SETTINGS_NAVS } from "@/constants/navs";

export function generateWAUrl(phone: string, message: string = ""): void {
  const sanitizedPhone = phone.trim().replace(/[^0-9]/g, "");

  const url = `https://wa.me/${sanitizedPhone}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
  window.open(url, "_blank");
  window.open(url, "_blank");
}

export function getNavLabelKey(pathname: string): string {
  for (const nav of NAVS) {
    if (nav.path === pathname) return nav.labelKey;
    if (nav.subMenus) {
      for (const sub of nav.subMenus) {
        if (sub.path === pathname) return sub.labelKey;
      }
    }
  }

  for (const nav of OTHER_NAVS) {
    if (nav.path === pathname) return nav.labelKey;
  }

  for (const group of SETTINGS_NAVS) {
    for (const item of group.list) {
      if (item.path === pathname) return item.labelKey;
    }
  }

  return "-";
}

export function getActiveNavs(pathname: string): Interface__NavItem[] {
  for (const nav of NAVS) {
    if (nav.path === pathname) return [nav];
    if (nav.subMenus) {
      for (const sub of nav.subMenus) {
        if (sub.path === pathname) return [nav, sub];
      }
    }
  }

  for (const nav of OTHER_NAVS) {
    if (nav.path === pathname) return [nav];
  }

  for (const group of SETTINGS_NAVS) {
    for (const nav of group.list) {
      if (nav.path === pathname) return [nav];
    }
  }

  return [];
}
