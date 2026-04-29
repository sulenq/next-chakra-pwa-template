import { create } from "zustand";

type LocationPermissions = {
  locationPermissionsStatus: PermissionState;
  updateLocationPermissionsStatus: () => void;
};
export const useLocationPermissions = create<LocationPermissions>((set) => {
  let initialStatus: PermissionState = "prompt";

  if (typeof navigator !== "undefined" && navigator.permissions) {
    navigator.permissions
      .query({ name: "geolocation" as PermissionName })
      .then((result) => {
        initialStatus = result.state;
        set({ locationPermissionsStatus: result.state });

        result.onchange = () =>
          set({ locationPermissionsStatus: result.state });
      })
      .catch(() => set({ locationPermissionsStatus: "denied" }));
  }

  return {
    locationPermissionsStatus: initialStatus,
    updateLocationPermissionsStatus: async () => {
      try {
        const result = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        set({ locationPermissionsStatus: result.state });
      } catch (error) {
        console.error(error);
        set({ locationPermissionsStatus: "denied" });
      }
    },
  };
});
