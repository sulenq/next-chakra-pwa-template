import { http } from "@/api/http";
import {
  SigninPayload,
  SigninResponseData,
} from "@/features/auth/types/auth.types";
import { BaseResponse, User } from "@/types/global.types";

// -----------------------------------------------------------------

export const signin = async (data: SigninPayload) => {
  const response = await http.post<BaseResponse<SigninResponseData>>(
    "/v1/auth/signin",
    data,
  );
  return response.data;
};

export const signout = async () => {
  const response = await http.post<BaseResponse>("/v1/auth/signout");
  return response.data;
};

export const getCurrentUser = async (signal?: AbortSignal) => {
  const response = await http.get<BaseResponse<User>>("/v1/auth/current-user", {
    signal,
  });
  return response.data;
};
