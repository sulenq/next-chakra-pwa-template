import { http } from "@/api/http";
import {
  AUTH_API_SIGNIN,
  AUTH_API_SIGNOUT,
  AUTH_API_USER_PROFILE,
} from "@/constants/apis";
import { BaseResponse, User } from "@/types/global.types";
import { SigninPayload, SigninResponseData } from "@/features/auth/types/auth.types";

export const signin = async (data: SigninPayload) => {
  const res = await http.post<BaseResponse<SigninResponseData>>(
    AUTH_API_SIGNIN,
    data,
  );
  return res.data;
};

export const signout = async () => {
  const res = await http.post<BaseResponse>(AUTH_API_SIGNOUT);
  return res.data;
};

export const getUserProfile = async (signal?: AbortSignal) => {
  const res = await http.get<BaseResponse<User>>(AUTH_API_USER_PROFILE, {
    signal,
  });
  return res.data;
};
