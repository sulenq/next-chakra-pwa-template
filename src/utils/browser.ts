export const browser = typeof window !== "undefined";

export const getStorage = (
  key: string,
  type: "local" | "session" = "local"
): string | null => {
  if (!browser) return null;
  const storage = type === "local" ? localStorage : sessionStorage;
  return storage.getItem(key);
};

export const setStorage = (
  key: string,
  value: string,
  type: "local" | "session" = "local"
) => {
  if (!browser) return;
  const storage = type === "local" ? localStorage : sessionStorage;
  storage.setItem(key, value);
};

export const removeStorage = (
  key: string,
  type: "local" | "session" = "local"
) => {
  if (!browser) return;
  const storage = type === "local" ? localStorage : sessionStorage;
  storage.removeItem(key);
};
