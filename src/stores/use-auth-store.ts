import { User } from "@/types/global.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "auth";
const ACCESS_TOKEN_TTL = 0;

type AuthState = {
  accessToken: string | null;
  user: User | null;
  role: object | null;
  permissions: string[] | null;
  updatedAt: number | null;
};

type AuthStore = {
  auth: AuthState;
  setAuth: (partial: Partial<AuthState>) => void;
  hasPermissions: (allowedPermissions: string[]) => boolean;
  removeAuth: () => void;
};

const DEFAULT_VALUES: AuthState = {
  accessToken: null,
  user: null,
  role: null,
  permissions: null,
  updatedAt: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      auth: { ...DEFAULT_VALUES },

      setAuth: (partial) =>
        set((state) => ({
          auth: {
            ...state.auth,
            ...partial,
            ...(partial.accessToken !== undefined
              ? { updatedAt: partial.accessToken ? Date.now() : null }
              : {}),
          },
        })),

      hasPermissions: (allowedPermissions) => {
        const userPermissions = get().auth.permissions ?? [];
        return allowedPermissions.every((permission) =>
          userPermissions.includes(permission),
        );
      },

      removeAuth: () => {
        set(() => ({ auth: { ...DEFAULT_VALUES } }));
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,

      migrate: (persistedState) => {
        const castedState = persistedState as Partial<AuthStore> | undefined;

        const now = Date.now();
        const lastUpdated = castedState?.auth?.updatedAt;

        if (
          ACCESS_TOKEN_TTL > 0 &&
          lastUpdated &&
          now - lastUpdated > ACCESS_TOKEN_TTL
        ) {
          console.warn("Token expired. Automatically clearing auth store.");
          return {
            ...castedState,
            auth: { ...DEFAULT_VALUES },
          } as AuthStore;
        }

        return castedState as AuthStore;
      },
    },
  ),
);
