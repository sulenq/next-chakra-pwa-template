import { setupInterceptors } from "@/api/interceptors";
import axios, { AxiosInstance } from "axios";

export const http: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { Accept: "application/json" },
});

setupInterceptors(http);
