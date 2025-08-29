import { create } from "zustand";

interface Props {
  authToken?: string;
  role?: object;
  permissions?: number[];
  setAuthToken: (newState: Props["authToken"]) => void;
  setRole: (newState: Props["role"]) => void;
  setPermissions: (newState: Props["permissions"]) => void;
  hasPermissions: (allowedPermissions: number[]) => boolean;
  removeAuth: () => void;
  removeAuthToken: () => void;
  removePermissions: () => void;
  removeRole: () => void;
}

const useAuthMiddleware = create<Props>((set, get) => ({
  authToken:
    typeof window !== "undefined"
      ? localStorage.getItem("__auth_token") || undefined
      : undefined,
  setAuthToken: (newState) =>
    set(() => {
      if (typeof window !== "undefined")
        localStorage.setItem("__auth_token", newState || "");
      return { authToken: newState };
    }),

  role: undefined,
  setRole: (newState) => set(() => ({ role: newState })),

  permissions: undefined,
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
    set(() => ({ authToken: undefined }));
  },

  removePermissions: () => set(() => ({ permissions: undefined })),

  removeRole: () => set(() => ({ role: undefined })),
}));

export default useAuthMiddleware;
