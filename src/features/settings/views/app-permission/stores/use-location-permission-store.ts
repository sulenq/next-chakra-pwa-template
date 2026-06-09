import { UnifiedPermissionState } from "@/types/global.types";
import { isClient } from "@/utils/client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type LocationPermissionsStore = {
  locationPermissionsStatus: UnifiedPermissionState;
  setLocationPermissionsStatus: (status: UnifiedPermissionState) => void;
  updateLocationPermissionsStatus: () => Promise<void>;
};

export const useLocationPermissionStore = create<LocationPermissionsStore>()(
  persist(
    (set) => ({
      locationPermissionsStatus: "prompt",
      setLocationPermissionsStatus: (status) => {
        set({ locationPermissionsStatus: status });
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
            console.error(error);
          }
        }

        // Fallback — state already hydrated via persist middleware
      },
    }),
    {
      name: "perm_location",
      onRehydrateStorage: () => (state) => {
        // Temporary grants don't survive browser restart
        if (state?.locationPermissionsStatus?.includes("_temporary")) {
          state.locationPermissionsStatus = "prompt";
        }
      },
    },
  ),
);

if (isClient()) {
  setTimeout(() => {
    useLocationPermissionStore.getState().updateLocationPermissionsStatus();
  }, 0);
}
