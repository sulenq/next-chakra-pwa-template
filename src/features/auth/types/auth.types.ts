import { User } from "@/types/global.types";

export interface SigninPayload {
  email: string;
  password?: string;
}

export interface SigninResponseData {
  authToken: string;
  user: User;
}
