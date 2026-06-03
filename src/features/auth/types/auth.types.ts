import { User } from "@/types/global.types";

export type AuthOptions<TData = any> = {
  onSuccess?: (data: TData) => void;
  onError?: (err: any) => void;
};

export type SigninPayload = {
  email: string;
  password?: string;
};

export type SigninResponseData = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // second
  user: User;
};

export type ResetPasswordStep1Payload = {
  email: string;
};

export type ResetPasswordStep1ResponseData = {
  email: string;
  otpExpiresIn: number; // second
};

export type ResetPasswordStep2Payload = {
  email: string;
  otp: string;
};

export type ResetPasswordStep2ResponseData = {
  resetPasswordToken: string;
  resetPasswordTokenExpiresIn: number; // second
};

export type ResetPasswordStep3Payload = {
  resetPasswordToken: string;
  newPassword: string;
  newPasswordConfirmation: string;
};

export type CurrentUserResponseData = {
  user: User;
};
