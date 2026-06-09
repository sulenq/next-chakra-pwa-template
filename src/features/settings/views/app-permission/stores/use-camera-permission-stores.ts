import { UnifiedPermissionState } from "@/types/global.types";
import { isClient } from "@/utils/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CameraPermissionStore = {
  cameraPermissionsStatus: UnifiedPermissionState;
  setCameraPermissionsStatus: (status: UnifiedPermissionState) => void;
  updateCameraPermissionsStatus: () => Promise<void>;
};

export const useCameraPermissionStore = create<CameraPermissionStore>()(
  persist(
    (set, get) => ({
      cameraPermissionsStatus: "prompt",
      setCameraPermissionsStatus: (status) => {
        set({ cameraPermissionsStatus: status });
      },
      updateCameraPermissionsStatus: async () => {
        if (!isClient()) return;

        // 1. Check active device labels
        try {
          if (
            navigator.mediaDevices &&
            navigator.mediaDevices.enumerateDevices
          ) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasActiveAccess = devices.some(
              (d) => d.kind === "videoinput" && d.label !== "",
            );
            if (hasActiveAccess) {
              const isPermanent =
                get().cameraPermissionsStatus === "granted_permanent";
              set({
                cameraPermissionsStatus: isPermanent
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
              name: "camera" as PermissionName,
            });

            const mapStatus = (
              state: PermissionState,
            ): UnifiedPermissionState => {
              if (state === "granted") return "granted_permanent";
              if (state === "denied") return "denied_permanent";
              return "prompt";
            };

            set({ cameraPermissionsStatus: mapStatus(result.state) });

            result.onchange = () => {
              set({ cameraPermissionsStatus: mapStatus(result.state) });
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
      name: "perm_camera",
      onRehydrateStorage: () => (state) => {
        // Temporary grants don't survive browser restart
        if (state?.cameraPermissionsStatus?.includes("_temporary")) {
          state.cameraPermissionsStatus = "prompt";
        }
      },
    },
  ),
);

if (isClient()) {
  setTimeout(() => {
    useCameraPermissionStore.getState().updateCameraPermissionsStatus();
  }, 0);
}
