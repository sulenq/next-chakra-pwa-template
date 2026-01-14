import { Interface__NavItem } from "@/constants/interfaces";
import { PRIVATE_NAVS, OTHER_PRIVATE_NAVS } from "@/constants/navs";

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
  privateNavs?: Interface__NavItem[]
): Interface__NavItem["list"][number][] => {
  const findInList = (
    items: Interface__NavItem["list"]
  ): Interface__NavItem["list"][number][] | null => {
    for (const item of items) {
      if (item.path === pathname) return [item];
      if (item.subMenus) {
        for (const subGroup of item.subMenus) {
          if (subGroup.list) {
            const found = findInList(subGroup.list);
            if (found) return [item, ...found];
          }
        }
      }
    }
    return null;
  };

  const resolvedPrivateNavs = privateNavs ?? PRIVATE_NAVS;

  for (const navGroup of resolvedPrivateNavs) {
    const result = findInList(navGroup.list);
    if (result) return result;
  }

  for (const navGroup of OTHER_PRIVATE_NAVS) {
    const result = findInList(navGroup.list);
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
