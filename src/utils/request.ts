import axios from "axios";
import { getAuthToken, setAuthToken } from "./authToken";

// Create Axios instance
export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { Accept: "application/json" },
  // withCredentials: true,
});

// Inject access token to request
request.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auto-refresh
request.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return request(originalRequest); // retry request
      }
    }

    return Promise.reject(error);
  }
);

// Refresh access token helper
async function refreshAccessToken(): Promise<string | null> {
  try {
    const r = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newToken = r.data.accessToken;
    setAuthToken(newToken);
    return newToken;
  } catch {
    return null;
  }
}
