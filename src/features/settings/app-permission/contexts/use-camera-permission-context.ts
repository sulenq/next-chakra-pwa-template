import { UnifiedPermissionState } from "@/types/global.types";
import {
  isClient,
  getStorage,
  setStorage,
  removeStorage,
} from "@/utils/client";
import { create } from "zustand";

type CameraPermissionStore = {
  cameraPermissionsStatus: UnifiedPermissionState;
  setCameraPermissionsStatus: (status: UnifiedPermissionState) => void;
  updateCameraPermissionsStatus: () => Promise<void>;
};

export const useCameraPermissionContext = create<CameraPermissionStore>(
  (set) => {
    return {
      cameraPermissionsStatus: "prompt",
      setCameraPermissionsStatus: (status) => {
        set({ cameraPermissionsStatus: status });
        if (status === "granted_temporary") {
          setStorage("perm_camera", "granted_temporary", "session");
          removeStorage("perm_camera_permanent", "local");
        } else if (status === "granted_permanent") {
          setStorage("perm_camera", "granted_permanent", "session");
          setStorage("perm_camera_permanent", "true", "local");
        } else if (status === "denied_temporary") {
          setStorage("perm_camera", "denied_temporary", "session");
          removeStorage("perm_camera_permanent", "local");
        } else if (status === "denied_permanent") {
          setStorage("perm_camera", "denied_permanent", "session");
          setStorage("perm_camera_permanent", "false", "local");
        } else {
          removeStorage("perm_camera", "session");
          removeStorage("perm_camera_permanent", "local");
        }
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
                getStorage("perm_camera_permanent", "local") === "true";
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
            // Firefox/Safari throws TypeError. Gracefully fall through.
          }
        }

        // 3. Fallback to cached states
        const cachedSession = getStorage(
          "perm_camera",
          "session",
        ) as UnifiedPermissionState | null;
        const cachedPermanent = getStorage("perm_camera_permanent", "local");

        if (cachedSession) {
          set({ cameraPermissionsStatus: cachedSession });
        } else if (cachedPermanent === "true") {
          set({ cameraPermissionsStatus: "granted_permanent" });
        } else if (cachedPermanent === "false") {
          set({ cameraPermissionsStatus: "denied_permanent" });
        } else {
          set({ cameraPermissionsStatus: "prompt" });
        }
      },
    };
  },
);

if (isClient()) {
  setTimeout(() => {
    useCameraPermissionContext.getState().updateCameraPermissionsStatus();
  }, 0);
}
