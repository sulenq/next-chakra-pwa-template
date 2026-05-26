import { http } from "@/api/http";
import {
  CurrentUserResponseData,
  ResetPasswordStep1Payload,
  ResetPasswordStep2Payload,
  ResetPasswordStep3Payload,
  SigninPayload,
  SigninResponseData,
} from "@/features/auth/types/auth.types";
import { BaseResponse } from "@/types/global.types";

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

export const resetPasswordStep1 = async (data: ResetPasswordStep1Payload) => {
  const response = await http.post("/v1/auth/reset-password/1", data);
  return response.data;
};

export const resetPasswordStep2 = async (data: ResetPasswordStep2Payload) => {
  const response = await http.post("/v1/auth/reset-password/2", data);
  return response.data;
};

export const resetPasswordStep3 = async (data: ResetPasswordStep3Payload) => {
  const response = await http.post("/v1/auth/reset-password/3", data);
  return response.data;
};

export const getCurrentUser = async (signal?: AbortSignal) => {
  const response = await http.get<BaseResponse<CurrentUserResponseData>>(
    "/v1/auth/current-user",
    {
      signal,
    },
  );
  return response.data;
};
