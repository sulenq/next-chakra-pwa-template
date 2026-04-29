import { setupInterceptors } from "@/api/interceptors";
import axios from "axios";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: { Accept: "application/json" },
});

setupInterceptors(http);
