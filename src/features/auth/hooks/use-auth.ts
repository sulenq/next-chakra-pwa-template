import {
  getCurrentUser,
  resetPasswordStep1,
  resetPasswordStep2,
  resetPasswordStep3,
  signin,
  signout,
} from "@/features/auth/services/auth.api";
import {
  AuthOptions,
  CurrentUserResponseData,
  ResetPasswordStep1Payload,
  ResetPasswordStep1ResponseData,
  ResetPasswordStep2Payload,
  ResetPasswordStep2ResponseData,
  ResetPasswordStep3Payload,
  SigninPayload,
} from "@/features/auth/types/auth.types";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { queryKeys } from "@/lib/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/lib/toast/toast.handler";
import { useAuthStore } from "@/stores/use-auth-store";
import { BaseResponse } from "@/types/global.types";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";

// -----------------------------------------------------------------

export const useSignin = (options?: AuthOptions) => {
  const { t } = useLocaleStore();
  const setAuth = useAuthStore((s) => s.setAuth);

  const toast = mutationToastHandlers("auth-signin", {
    loadingMessage: t.loading_signin,
    successMessage: t.success_signin,
  });

  return useMutation({
    mutationFn: (data: SigninPayload) => signin(data),
    onMutate: toast.onLoading,
    onSuccess: (response) => {
      toast.onSuccess();

      const accessToken = response.data?.accessToken;
      const user = response.data?.user;
      const permissions = response.data?.user?.role?.permissions;

      if (accessToken && user) setAuth({ accessToken, user });
      if (permissions) setAuth({ permissions });

      options?.onSuccess?.(response);
    },
    onError: (err) => {
      toast.onError(err);

      options?.onError?.(err);
    },
  });
};

export const useSignout = (options?: AuthOptions) => {
  const { t } = useLocaleStore();
  const removeAuth = useAuthStore((s) => s.removeAuth);

  const toast = mutationToastHandlers("auth-signout", {
    loadingMessage: t.loading_signout,
    successMessage: t.success_signout,
  });

  return useMutation({
    mutationFn: () => signout(),
    onMutate: toast.onLoading,
    onSuccess: (response) => {
      toast.onSuccess();
      removeAuth();

      options?.onSuccess?.(response);
    },
    onError: (err) => {
      toast.onError(err);
      removeAuth();

      options?.onError?.(err);
    },
  });
};

export const useResetPasswordStep1 = (
  options?: AuthOptions<BaseResponse<ResetPasswordStep1ResponseData>>,
) => {
  const { t } = useLocaleStore();

  const toast = mutationToastHandlers("auth-reset-password", {
    loadingMessage: t.loading_sending_otp,
    successMessage: t.success_otp_sent,
  });

  return useMutation({
    mutationFn: (data: ResetPasswordStep1Payload) => resetPasswordStep1(data),
    onMutate: toast.onLoading,
    onSuccess: (response) => {
      toast.onSuccess();

      options?.onSuccess?.(response);
    },
    onError: (response) => {
      toast.onError(response);

      options?.onError?.(response);
    },
  });
};

export const useResetPasswordStep2 = (
  options?: AuthOptions<BaseResponse<ResetPasswordStep2ResponseData>>,
) => {
  const { t } = useLocaleStore();

  const toast = mutationToastHandlers("auth-reset-password", {
    loadingMessage: t.loading_verify_otp,
    successMessage: t.success_verify_otp,
  });

  return useMutation({
    mutationFn: (data: ResetPasswordStep2Payload) => resetPasswordStep2(data),
    onMutate: toast.onLoading,
    onSuccess: (response) => {
      toast.onSuccess();

      options?.onSuccess?.(response);
    },
    onError: (err) => {
      toast.onError(err);

      options?.onError?.(err);
    },
  });
};

export const useResetPasswordStep3 = (options?: AuthOptions) => {
  const { t } = useLocaleStore();

  const toast = mutationToastHandlers("auth-reset-password", {
    loadingMessage: t.loading_save_new_password,
    successMessage: t.success_save_new_password,
  });

  return useMutation({
    mutationFn: (data: ResetPasswordStep3Payload) => resetPasswordStep3(data),
    onMutate: toast.onLoading,
    onSuccess: (response) => {
      toast.onSuccess();

      options?.onSuccess?.(response);
    },
    onError: (err) => {
      toast.onError(err);

      options?.onError?.(err);
    },
  });
};

export const useCurrentUser = (
  options?: Omit<
    UseQueryOptions<BaseResponse<CurrentUserResponseData>, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery<BaseResponse<CurrentUserResponseData>, Error>({
    queryKey: queryKeys.auth.profile(),
    queryFn: ({ signal }) => getCurrentUser(signal),
    ...options,
  });
};
