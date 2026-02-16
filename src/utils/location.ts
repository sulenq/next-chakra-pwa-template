export const getAddress = (lat: number, lon: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      );

      if (!res.ok) return reject(null);

      const data = await res.json();
      resolve(data || null);
    } catch {
      reject(null);
    }
  });
};

export const getLatLon = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(null);

    navigator.geolocation.getCurrentPosition(resolve, () => reject(null));
  });
};
