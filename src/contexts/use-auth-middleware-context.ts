import {
  clearAccessToken,
  clearUserData,
  getAccessToken,
  setAccessToken,
} from "@/utils/auth";
import { create } from "zustand";

// -----------------------------------------------------------------

type AuthMiddlewareStore = {
  verifiedAccessToken: string | null;
  setVerifiedAccessToken: (
    newState: AuthMiddlewareStore["verifiedAccessToken"],
  ) => void;

  role: object | null;
  setRole: (newState: AuthMiddlewareStore["role"]) => void;

  permissions: string[] | null;
  setPermissions: (newState: AuthMiddlewareStore["permissions"]) => void;
  hasPermissions: (allowedPermissions: string[]) => boolean;

  removeAuth: () => void;
};

export const useAuthMiddlewareContext = create<AuthMiddlewareStore>(
  (set, get) => ({
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
      return allowedPermissions.every((permission) =>
        userPermissions.includes(permission),
      );
    },

    removeAuth: () => {
      get().setPermissions(null);
      get().setRole(null);
      get().setVerifiedAccessToken(null);
      clearAccessToken();
      clearUserData();
    },
  }),
);
