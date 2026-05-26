import { UnifiedPermissionState } from "@/types/global.types";
import { isClient } from "@/utils/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type MicPermissionsStore = {
  micPermissionsStatus: UnifiedPermissionState;
  setMicPermissionsStatus: (status: UnifiedPermissionState) => void;
  updateMicPermissionsStatus: () => Promise<void>;
};

export const useMicPermissionStore = create<MicPermissionsStore>()(
  persist(
    (set, get) => ({
      micPermissionsStatus: "prompt",
      setMicPermissionsStatus: (status) => {
        set({ micPermissionsStatus: status });
      },
      updateMicPermissionsStatus: async () => {
        if (!isClient()) return;

        // 1. Check active device labels
        try {
          if (
            navigator.mediaDevices &&
            navigator.mediaDevices.enumerateDevices
          ) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasActiveAccess = devices.some(
              (d) => d.kind === "audioinput" && d.label !== "",
            );
            if (hasActiveAccess) {
              const isPermanent =
                get().micPermissionsStatus === "granted_permanent";
              set({
                micPermissionsStatus: isPermanent
                  ? "granted_permanent"
                  : "granted_temporary",
              });
              return;
            }
          }
        } catch (e) {
          console.error("enumerateDevices failed:", e);
        }

        // 2. Try standard permissions query (Chromium)
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const result = await navigator.permissions.query({
              name: "microphone" as PermissionName,
            });

            const mapStatus = (
              state: PermissionState,
            ): UnifiedPermissionState => {
              if (state === "granted") return "granted_permanent";
              if (state === "denied") return "denied_permanent";
              return "prompt";
            };

            set({ micPermissionsStatus: mapStatus(result.state) });

            result.onchange = () => {
              set({ micPermissionsStatus: mapStatus(result.state) });
            };
            return;
          } catch (error) {
            console.error(error);
          }
        }

        // 3. Fallback — state already hydrated via persist middleware
      },
    }),
    {
      name: "perm_mic",
      onRehydrateStorage: () => (state) => {
        // Temporary grants don't survive browser restart
        if (state?.micPermissionsStatus?.includes("_temporary")) {
          state.micPermissionsStatus = "prompt";
        }
      },
    },
  ),
);

if (isClient()) {
  setTimeout(() => {
    useMicPermissionStore.getState().updateMicPermissionsStatus();
  }, 0);
}
