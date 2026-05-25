import { WELCOME_ROUTE } from "@/constants/routes";
import {
  getUserProfile,
  signin,
  signout,
} from "@/features/auth/services/auth.api";
import { SigninPayload } from "@/features/auth/types/auth.types";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { queryKeys } from "@/lib/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/lib/toast/toast.handler";
import { useAuthStore } from "@/stores/use-auth-store";
import { BaseResponse, User } from "@/types/global.types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// -----------------------------------------------------------------

export const useSignin = () => {
  const { t } = useLocaleStore();
  const router = useRouter();

  const setAuth = useAuthStore((s) => s.setAuth);

  const toast = mutationToastHandlers("auth-signin", {
    loadingMessage: t.loading_signin,
    successMessage: t.success_signin,
  });

  return useMutation({
    mutationFn: (data: SigninPayload) => signin(data),
    onMutate: toast.onLoading,
    onSuccess: (res) => {
      toast.onSuccess();

      const accessToken = res.data?.authToken;
      const user = res.data?.user;
      const permissions = res.data?.user?.role?.permissions;

      if (accessToken && user) setAuth({ accessToken, user });
      if (permissions) setAuth({ permissions });

      router.push(WELCOME_ROUTE);
    },
    onError: toast.onError,
  });
};

export const useSignout = (options?: {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) => {
  const { t } = useLocaleStore();
  const removeAuth = useAuthStore((s) => s.removeAuth);

  const toast = mutationToastHandlers("auth-signout", {
    loadingMessage: t.loading_signout,
    successMessage: t.success_signout,
  });

  return useMutation({
    mutationFn: () => signout(),
    onMutate: toast.onLoading,
    onSuccess: () => {
      toast.onSuccess();
      removeAuth();
      options?.onSuccess?.();
    },
    onError: (err) => {
      // Clear token & auth contexts anyway to avoid user being stuck on network errors
      removeAuth();
      options?.onError?.(err);
    },
  });
};

export const useUserProfile = (options?: any) => {
  return useQuery<BaseResponse<User>, Error>({
    queryKey: queryKeys.auth.profile(),
    queryFn: ({ signal }) => getUserProfile(signal),
    ...options,
  });
};
