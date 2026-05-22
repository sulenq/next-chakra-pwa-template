import { User } from "@/types/global.types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const STORAGE_KEY = "auth-storage";
const ACCESS_TOKEN_TTL = 0;

type AuthState = {
  accessTokenContext: string | null;
  user: User | null;
  role: object | null;
  permissions: string[] | null;
  updatedAt: number | null;
};

type AuthActions = {
  setAccessToken: (newState: AuthState["accessTokenContext"]) => void;
  setRole: (newState: AuthState["role"]) => void;
  setPermissions: (newState: AuthState["permissions"]) => void;
  setUser: (user: User) => void;
  hasPermissions: (allowedPermissions: string[]) => boolean;
  removeAuth: () => void;
};

type AuthStore = AuthState & AuthActions;

type PersistedAuthState = Partial<AuthState> & {
  updatedAt?: number | null;
};

const DEFAULT_VALUES: AuthState = {
  accessTokenContext: null,
  user: null,
  role: null,
  permissions: null,
  updatedAt: null,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_VALUES,

      setAccessToken: (newState) =>
        set(() => ({
          accessTokenContext: newState,
          updatedAt: newState ? Date.now() : null,
        })),

      setRole: (newState) => set(() => ({ role: newState })),

      setPermissions: (newState) => set(() => ({ permissions: newState })),

      setUser: (newState) =>
        set(() => ({
          user: newState,
        })),

      hasPermissions: (allowedPermissions) => {
        const userPermissions = get().permissions ?? [];
        return allowedPermissions.every((permission) =>
          userPermissions.includes(permission),
        );
      },

      removeAuth: () => {
        set(DEFAULT_VALUES);
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,

      migrate: (persistedState) => {
        const castedState = persistedState as PersistedAuthState | undefined;

        const now = Date.now();
        const lastUpdated = castedState?.updatedAt;

        if (
          ACCESS_TOKEN_TTL > 0 &&
          lastUpdated &&
          now - lastUpdated > ACCESS_TOKEN_TTL
        ) {
          console.warn("Token expired. Automatically clearing auth store.");
          return {
            ...castedState,
            ...DEFAULT_VALUES,
          } as AuthStore;
        }

        return castedState as AuthStore;
      },
    },
  ),
);
