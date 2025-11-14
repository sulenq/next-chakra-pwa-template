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
      if (typeof window !== "undefined")
        localStorage.setItem("__auth_token", newState || "");
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
  },

  removeAuthToken: () => {
    if (typeof window !== "undefined") localStorage.removeItem("__auth_token");
    set(() => ({ verifiedAuthToken: undefined }));
  },

  removePermissions: () => set(() => ({ permissions: undefined })),

  removeRole: () => set(() => ({ role: undefined })),
}));

export default useAuthMiddleware;
