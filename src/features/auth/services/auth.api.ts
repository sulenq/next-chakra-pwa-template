import { http } from "@/api/http";
import {
  SigninPayload,
  SigninResponseData,
} from "@/features/auth/types/auth.types";
import { BaseResponse, User } from "@/types/global.types";

// -----------------------------------------------------------------

export const signin = async (data: SigninPayload) => {
  const response = await http.post<BaseResponse<SigninResponseData>>(
    "/api/login",
    data,
  );
  return response.data;
};

export const signout = async () => {
  const response = await http.post<BaseResponse>("/api/logout");
  return response.data;
};

export const getUserProfile = async (signal?: AbortSignal) => {
  const response = await http.get<BaseResponse<User>>("/api/get-user-profile", {
    signal,
  });
  return response.data;
};
