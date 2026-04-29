import { Interface__User } from "@/shared/constants/interfaces";
import { getStorage, removeStorage, setStorage } from "@/shared/utils/client";

export function getAccessToken() {
  return getStorage("__access_token") || null;
}

export function setAccessToken(token: string) {
  setStorage("__access_token", token, "local", 259200000);
}

export function clearAccessToken() {
  removeStorage("__access_token");
}

export function getUserData(): Interface__User | null {
  const raw = getStorage("__user_data");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse user data:", e);
    return null;
  }
}

export function setUserData(user: Interface__User) {
  try {
    setStorage("__user_data", JSON.stringify(user), "local", 259200000);
  } catch (e) {
    console.error("Failed to stringify user data:", e);
  }
}

export function clearUserData() {
  removeStorage("__user_data");
}

export const isPermissionAllowed = (permission: string) => {
  const user = getUserData();
  const userPermissions = user?.role?.permissions;
  return userPermissions?.includes(permission);
};

export const isRoleAllowed = (role: string) => {
  const user = getUserData();
  const userRole = user?.role?.id;
  return userRole === role;
};
