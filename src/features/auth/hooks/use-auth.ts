import { WELCOME_ROUTE } from "@/constants/routes";
import { useAuthContext } from "@/contexts/use-auth-context";
import useRenderTrigger from "@/contexts/use-render-trigger";
import {
  getUserProfile,
  signin,
  signout,
} from "@/features/auth/services/auth.api";
import { SigninPayload } from "@/features/auth/types/auth.types";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { queryKeys } from "@/lib/tanstack-query/query.keys";
import { mutationToastHandlers } from "@/lib/toast/toast.handler";
import { setAccessToken, setUserData } from "@/utils/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { BaseResponse, User } from "@/types/global.types";

// -----------------------------------------------------------------

export const useSignin = () => {
  const { t } = useLocaleContext();
  const router = useRouter();

  const setAccessTokenContext = useAuthContext((s) => s.setAccessTokenContext);
  const setPermissions = useAuthContext((s) => s.setPermissions);

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
      const userData = res.data?.user;
      const permissionsData =
        (res.data?.user as any)?.permissions ||
        res.data?.user?.role?.permissions;

      if (accessToken && userData) {
        setAccessToken(accessToken);
        setUserData(userData);
        setAccessTokenContext(accessToken);
        if (permissionsData) {
          setPermissions(permissionsData);
        }
      }

      router.push(WELCOME_ROUTE);
    },
    onError: toast.onError,
  });
};

export const useSignout = (options?: {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}) => {
  const { t } = useLocaleContext();
  const removeAuth = useAuthContext((s) => s.removeAuth);
  const setRt = useRenderTrigger((s) => s.setRt);

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
      setRt((ps) => !ps);
      options?.onSuccess?.();
    },
    onError: (err) => {
      // Clear token & auth contexts anyway to avoid user being stuck on network errors
      removeAuth();
      setRt((ps) => !ps);
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
