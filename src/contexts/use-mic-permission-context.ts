import { UnifiedPermissionState } from "@/types/global.types";
import { isClient, getStorage, setStorage, removeStorage } from "@/utils/client";
import { create } from "zustand";

type MicPermissionsStore = {
  micPermissionsStatus: UnifiedPermissionState;
  setMicPermissionsStatus: (status: UnifiedPermissionState) => void;
  updateMicPermissionsStatus: () => Promise<void>;
};

export const useMicPermissions = create<MicPermissionsStore>((set) => {
  return {
    micPermissionsStatus: "prompt",
    setMicPermissionsStatus: (status) => {
      set({ micPermissionsStatus: status });
      if (status === "granted_temporary") {
        setStorage("perm_mic", "granted_temporary", "session");
        removeStorage("perm_mic_permanent", "local");
      } else if (status === "granted_permanent") {
        setStorage("perm_mic", "granted_permanent", "session");
        setStorage("perm_mic_permanent", "true", "local");
      } else if (status === "denied_temporary") {
        setStorage("perm_mic", "denied_temporary", "session");
        removeStorage("perm_mic_permanent", "local");
      } else if (status === "denied_permanent") {
        setStorage("perm_mic", "denied_permanent", "session");
        setStorage("perm_mic_permanent", "false", "local");
      } else {
        removeStorage("perm_mic", "session");
        removeStorage("perm_mic_permanent", "local");
      }
    },
    updateMicPermissionsStatus: async () => {
      if (!isClient()) return;

      // 1. Check active device labels
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const hasActiveAccess = devices.some(
            (d) => d.kind === "audioinput" && d.label !== ""
          );
          if (hasActiveAccess) {
            const isPermanent = getStorage("perm_mic_permanent", "local") === "true";
            set({
              micPermissionsStatus: isPermanent ? "granted_permanent" : "granted_temporary",
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

          const mapStatus = (state: PermissionState): UnifiedPermissionState => {
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
          // Firefox/Safari throws TypeError. Gracefully fall through.
        }
      }

      // 3. Fallback to cached states
      const cachedSession = getStorage("perm_mic", "session") as UnifiedPermissionState | null;
      const cachedPermanent = getStorage("perm_mic_permanent", "local");

      if (cachedSession) {
        set({ micPermissionsStatus: cachedSession });
      } else if (cachedPermanent === "true") {
        set({ micPermissionsStatus: "granted_permanent" });
      } else if (cachedPermanent === "false") {
        set({ micPermissionsStatus: "denied_permanent" });
      } else {
        set({ micPermissionsStatus: "prompt" });
      }
    },
  };
});

if (isClient()) {
  setTimeout(() => {
    useMicPermissions.getState().updateMicPermissionsStatus();
  }, 0);
}
