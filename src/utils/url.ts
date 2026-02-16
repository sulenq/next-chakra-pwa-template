import { Interface__NavGroup } from "@/constants/interfaces";
import { PRIVATE_NAV_GROUPS, OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";

export function generateWAUrl(phone: string, message: string = ""): void {
  const sanitizedPhone = phone.trim().replace(/[^0-9]/g, "");

  const url = `https://wa.me/${sanitizedPhone}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
  window.open(url, "_blank");
  window.open(url, "_blank");
}

export const getActiveNavs = (
  pathname: string,
  privateNavs?: Interface__NavGroup[],
): Interface__NavGroup["list"][number][] => {
  const findInList = (
    items: Interface__NavGroup["list"],
  ): Interface__NavGroup["list"][number][] | null => {
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

  const resolvedPrivateNavs = privateNavs ?? PRIVATE_NAV_GROUPS;

  for (const navGroup of resolvedPrivateNavs) {
    const result = findInList(navGroup.navs);
    if (result) return result;
  }

  for (const navGroup of OTHER_PRIVATE_NAV_GROUPS) {
    const result = findInList(navGroup.navs);
    if (result) return result;
  }

  return [];
};

export const imgUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  return `${process.env.NEXT_PUBLIC_IMG_STORAGE_BASE_URL}${
    url.startsWith("/") ? "" : "/"
  }${url}`;
};

export const videoUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  return `${process.env.NEXT_PUBLIC_VIDEO_STORAGE_BASE_URL}${
    url.startsWith("/") ? "" : "/"
  }${url}`;
};

export const fileUrl = (url?: string | null): string | undefined => {
  if (!url) return undefined;

  return `${process.env.NEXT_PUBLIC_FILE_STORAGE_BASE_URL}${
    url.startsWith("/") ? "" : "/"
  }${url}`;
};

export const toAbsoluteUrl = (path: string) => {
  if (typeof window === "undefined") return path;
  return `${window.location.origin}${path}`;
};

export const normalizeUrl = (url: string) => {
  // If already absolute (http/https), do nothing
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  // If running on server, return raw (CSR nanti akan benar)
  if (typeof window === "undefined") {
    return url;
  }

  // Make relative -> absolute
  return `${window.location.origin}${url}`;
};
