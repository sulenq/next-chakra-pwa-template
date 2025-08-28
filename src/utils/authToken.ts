import { getStorage, removeStorage, setStorage } from "./client";

export function getAuthToken() {
  return getStorage("__auth_token") || null;
}

export function setAuthToken(token: string) {
  setStorage("__auth_token", token);
}

export function clearAuthToken() {
  removeStorage("__auth_token");
}
