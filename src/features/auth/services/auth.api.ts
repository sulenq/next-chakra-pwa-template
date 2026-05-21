import { http } from "@/api/http";
import {
  SigninPayload,
  SigninResponseData,
} from "@/features/auth/types/auth.types";
import { BaseResponse, User } from "@/types/global.types";

// -----------------------------------------------------------------

export const signin = async (data: SigninPayload) => {
  const res = await http.post<BaseResponse<SigninResponseData>>(
    "/api/login",
    data,
  );
  return res.data;
};

export const signout = async () => {
  const res = await http.post<BaseResponse>("/api/logout");
  return res.data;
};

export const getUserProfile = async (signal?: AbortSignal) => {
  const res = await http.get<BaseResponse<User>>("/api/get-user-profile", {
    signal,
  });
  return res.data;
};
