export function client() {
  return typeof window !== "undefined";
}

export function back() {
  window.history.back();
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

export function doCall(phoneNumber: string) {
  const sanitizedPhone = phoneNumber.trim().replace(/[^0-9+]/g, "");

  const testLink = document.createElement("a");
  testLink.href = `tel:${sanitizedPhone}`;

  if (testLink.protocol === "tel:") {
    window.location.href = testLink.href;
  } else {
    alert("This device does not support phone calls.");
  }
}
