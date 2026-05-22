import {
  clearAccessToken,
  clearUserData,
  getAccessToken,
  setAccessToken as setAccessTokenToLocalStorage,
} from "@/utils/auth";
import { create } from "zustand";

// -----------------------------------------------------------------

type AuthStore = {
  accessTokenContext: string | null;
  setAccessTokenContext: (newState: AuthStore["accessTokenContext"]) => void;

  role: object | null;
  setRole: (newState: AuthStore["role"]) => void;

  permissions: string[] | null;
  setPermissions: (newState: AuthStore["permissions"]) => void;
  hasPermissions: (allowedPermissions: string[]) => boolean;

  removeAuth: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  accessTokenContext: getAccessToken(),
  setAccessTokenContext: (newState) =>
    set(() => {
      if (typeof window !== "undefined")
        setAccessTokenToLocalStorage(newState || "");
      return { accessTokenContext: newState };
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
    get().setAccessTokenContext(null);
    clearAccessToken();
    clearUserData();
  },
}));
