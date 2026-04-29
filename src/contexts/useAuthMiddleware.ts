import {
  clearAccessToken,
  clearUserData,
  getAccessToken,
  setAccessToken,
} from "@/utils/auth";
import { removeStorage } from "@/utils/client";
import { create } from "zustand";

type AuthMiddlewareStore = {
  verifiedAccessToken: string | null;
  role: object | null;
  permissions: number[] | null;

  setVerifiedAccessToken: (
    newState: AuthMiddlewareStore["verifiedAccessToken"],
  ) => void;
  setRole: (newState: AuthMiddlewareStore["role"]) => void;
  setPermissions: (newState: AuthMiddlewareStore["permissions"]) => void;

  hasPermissions: (allowedPermissions: number[]) => boolean;

  removeAuthContext: () => void;
  removeAuthToken: () => void;
  removePermissions: () => void;
  removeRole: () => void;
};
export const useAuthMiddleware = create<AuthMiddlewareStore>((set, get) => ({
  verifiedAccessToken: getAccessToken(),
  setVerifiedAccessToken: (newState) =>
    set(() => {
      if (typeof window !== "undefined") setAccessToken(newState || "");
      return { verifiedAccessToken: newState };
    }),

  role: null,
  setRole: (newState) => set(() => ({ role: newState })),

  permissions: null,
  setPermissions: (newState) => set(() => ({ permissions: newState })),

  hasPermissions: (allowedPermissions) => {
    const userPermissions = get().permissions ?? [];
    return allowedPermissions.every((perm) => userPermissions.includes(perm));
  },

  removeAuthContext: () => {
    get().removePermissions();
    get().removeRole();
    get().setVerifiedAccessToken(null);
    clearAccessToken();
    clearUserData();
  },

  removeAuthToken: () => {
    if (typeof window !== "undefined") {
      removeStorage("__access_token");
    }
    set(() => ({ authToken: null, verifiedAccessToken: null }));
  },

  removePermissions: () => set(() => ({ permissions: undefined })),

  removeRole: () => set(() => ({ role: undefined })),
}));
