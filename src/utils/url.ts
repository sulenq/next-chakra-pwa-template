export function generateWAUrl(phone: string, message: string = ""): void {
  const sanitizedPhone = phone.trim().replace(/[^0-9]/g, "");

  const url = `https://wa.me/${sanitizedPhone}${
    message ? `?text=${encodeURIComponent(message)}` : ""
  }`;
  window.open(url, "_blank");
  window.open(url, "_blank");
}

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
