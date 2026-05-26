import { User } from "@/types/global.types";

export interface AuthOptions<TData = any> {
  onSuccess?: (data: TData) => void;
  onError?: (err: any) => void;
}

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

export interface ResetPasswordStep1Payload {
  email: string;
}

export interface ResetPasswordStep1ResponseData {
  email: string;
  otpExpiresIn: number; // second
}

export interface ResetPasswordStep2Payload {
  email: string;
  otp: string;
}

export interface ResetPasswordStep2ResponseData {
  resetPasswordToken: string;
  resetPasswordTokenExpiresIn: number; // second
}

export interface ResetPasswordStep3Payload {
  resetPasswordToken: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

export interface CurrentUserResponseData {
  user: User;
}
