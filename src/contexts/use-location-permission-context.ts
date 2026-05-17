import { UnifiedPermissionState } from "@/types/global.types";
import {
  isClient,
  getStorage,
  setStorage,
  removeStorage,
} from "@/utils/client";
import { create } from "zustand";

type LocationPermissionsStore = {
  locationPermissionsStatus: UnifiedPermissionState;
  setLocationPermissionsStatus: (status: UnifiedPermissionState) => void;
  updateLocationPermissionsStatus: () => Promise<void>;
};

export const useLocationPermissions = create<LocationPermissionsStore>(
  (set) => {
    return {
      locationPermissionsStatus: "prompt",
      setLocationPermissionsStatus: (status) => {
        set({ locationPermissionsStatus: status });
        if (status === "granted_temporary") {
          setStorage("perm_location", "granted_temporary", "session");
          removeStorage("perm_location_permanent", "local");
        } else if (status === "granted_permanent") {
          setStorage("perm_location", "granted_permanent", "session");
          setStorage("perm_location_permanent", "true", "local");
        } else if (status === "denied_temporary") {
          setStorage("perm_location", "denied_temporary", "session");
          removeStorage("perm_location_permanent", "local");
        } else if (status === "denied_permanent") {
          setStorage("perm_location", "denied_permanent", "session");
          setStorage("perm_location_permanent", "false", "local");
        } else {
          removeStorage("perm_location", "session");
          removeStorage("perm_location_permanent", "local");
        }
      },
      updateLocationPermissionsStatus: async () => {
        if (!isClient()) return;

        // Geolocation is widely supported in Permissions API query, including Firefox
        if (navigator.permissions && navigator.permissions.query) {
          try {
            const result = await navigator.permissions.query({
              name: "geolocation" as PermissionName,
            });

            const mapStatus = (
              state: PermissionState,
            ): UnifiedPermissionState => {
              if (state === "granted") return "granted_permanent";
              if (state === "denied") return "denied_permanent";
              return "prompt";
            };

            set({ locationPermissionsStatus: mapStatus(result.state) });

            result.onchange = () => {
              set({ locationPermissionsStatus: mapStatus(result.state) });
            };
            return;
          } catch (error) {
            // Gracefully fall through
          }
        }

        // Fallback to cached states
        const cachedSession = getStorage(
          "perm_location",
          "session",
        ) as UnifiedPermissionState | null;
        const cachedPermanent = getStorage("perm_location_permanent", "local");

        if (cachedSession) {
          set({ locationPermissionsStatus: cachedSession });
        } else if (cachedPermanent === "true") {
          set({ locationPermissionsStatus: "granted_permanent" });
        } else if (cachedPermanent === "false") {
          set({ locationPermissionsStatus: "denied_permanent" });
        } else {
          set({ locationPermissionsStatus: "prompt" });
        }
      },
    };
  },
);

if (isClient()) {
  setTimeout(() => {
    useLocationPermissions.getState().updateLocationPermissionsStatus();
  }, 0);
}
