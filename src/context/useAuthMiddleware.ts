import { clearAccessToken, clearUserData, setAccessToken } from "@/utils/auth";
import { removeStorage } from "@/utils/client";
import { create } from "zustand";

interface Props {
  verifiedAuthToken: string | null;
  role: object | null;
  permissions: number[] | null;

  setVerifiedAuthToken: (newState: Props["verifiedAuthToken"]) => void;
  setRole: (newState: Props["role"]) => void;
  setPermissions: (newState: Props["permissions"]) => void;

  hasPermissions: (allowedPermissions: number[]) => boolean;

  removeAuth: () => void;
  removeAuthToken: () => void;
  removePermissions: () => void;
  removeRole: () => void;
}

const useAuthMiddleware = create<Props>((set, get) => ({
  verifiedAuthToken: null,
  setVerifiedAuthToken: (newState) =>
    set(() => {
      if (typeof window !== "undefined") setAccessToken(newState || "");
      return { verifiedAuthToken: newState };
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
    get().setVerifiedAuthToken(null);
    clearAccessToken();
    clearUserData();
  },

  removeAuthToken: () => {
    if (typeof window !== "undefined") {
      removeStorage("__access_token");
    }
    set(() => ({ authToken: null, verifiedAuthToken: null }));
  },

  removePermissions: () => set(() => ({ permissions: undefined })),

  removeRole: () => set(() => ({ role: undefined })),
}));

export default useAuthMiddleware;
