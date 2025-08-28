export function client() {
  return typeof window !== "undefined";
}

export const getStorage = (
  key: string,
  type: "local" | "session" = "local"
): string | null => {
  if (!client()) return null;
  const storage = type === "local" ? localStorage : sessionStorage;
  return storage.getItem(key);
};

export const setStorage = (
  key: string,
  value: string,
  type: "local" | "session" = "local"
) => {
  if (!client()) return;
  const storage = type === "local" ? localStorage : sessionStorage;
  storage.setItem(key, value);
};

export const removeStorage = (
  key: string,
  type: "local" | "session" = "local"
) => {
  if (!client()) return;
  const storage = type === "local" ? localStorage : sessionStorage;
  storage.removeItem(key);
};
