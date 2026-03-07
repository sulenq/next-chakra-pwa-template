import {
  clearAccessToken,
  clearUserData,
  getAccessToken,
  setAccessToken,
} from "@/utils/auth";
import { removeStorage } from "@/utils/client";
import { create } from "zustand";

interface Props {
  verifiedAccessToken: string | null;
  role: object | null;
  permissions: number[] | null;

  setVerifiedAccessToken: (newState: Props["verifiedAccessToken"]) => void;
  setRole: (newState: Props["role"]) => void;
  setPermissions: (newState: Props["permissions"]) => void;

  hasPermissions: (allowedPermissions: number[]) => boolean;

  removeAuth: () => void;
  removeAuthToken: () => void;
  removePermissions: () => void;
  removeRole: () => void;
}

const useAuthMiddleware = create<Props>((set, get) => ({
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

  removeAuth: () => {
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

export default useAuthMiddleware;
