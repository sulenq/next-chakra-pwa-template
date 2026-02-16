import axios from "axios";
import { getAccessToken, setAccessToken } from "./auth";

// create axios instance
export const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { Accept: "application/json" },
  withCredentials: true, // uncoment if use refresh token
});

// inject access token to request
request.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor for auto-refresh
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

// refresh access token helper
async function refreshAccessToken(): Promise<string | null> {
  try {
    const r = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newToken = r.data.accessToken;
    setAccessToken(newToken);
    return newToken;
  } catch {
    return null;
  }
}
