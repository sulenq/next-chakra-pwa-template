import { useAuthStore } from "@/stores/use-auth-store";
import axios from "axios";

export const setupInterceptors = (http: any) => {
  http.interceptors.request.use(
    (config: any) => {
      const token = useAuthStore.getState().auth.accessToken;
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error: any) => Promise.reject(error),
  );

  http.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return http(originalRequest);
        }
      }

      return Promise.reject(error);
    },
  );
};

async function refreshAccessToken(): Promise<string | null> {
  try {
    const r = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const newToken = r.data.accessToken;
    useAuthStore.getState().setAuth({ accessToken: newToken });
    return newToken;
  } catch {
    return null;
  }
}
