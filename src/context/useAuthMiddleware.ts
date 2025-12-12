import { setAccessToken } from "@/utils/auth";
import { getStorage, removeStorage } from "@/utils/client";
import { create } from "zustand";

interface Props {
  authToken: string | null;
  setAccessToken: (newState: Props["authToken"]) => void;

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
  authToken: getStorage("__access_token"),
  setAccessToken: (newState) => set(() => ({ authToken: newState })),

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
    get().removeAuthToken();
    get().removePermissions();
    get().removeRole();
    removeStorage("__user_data");
    get().setVerifiedAuthToken(null);
    get().setAccessToken(null);
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
