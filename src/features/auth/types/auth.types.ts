import { User } from "@/types/global.types";

export interface SigninPayload {
  email: string;
  password?: string;
}

export interface SigninResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // second
  user: User;
}
