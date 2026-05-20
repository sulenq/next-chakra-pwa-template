import { useAuthMiddleware } from "@/contexts/use-auth-middleware-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { signin, signout, getUserProfile } from "@/features/auth/services/auth.api";
import { SigninPayload } from "@/features/auth/types/auth.types";
import { mutationToastHandlers } from "@/lib/toast/toast.handler";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/tanstack-query/query.keys";
import { clearAccessToken, clearUserData, setAccessToken, setUserData } from "@/utils/auth";
import { useRouter } from "next/navigation";
import useRenderTrigger from "@/contexts/use-render-trigger";

const INDEX_ROUTE = "/welcome";

export const useSigninMutation = () => {
  const { t } = useLocaleContext();
  const router = useRouter();
  
  const setVerifiedAccessToken = useAuthMiddleware((s) => s.setVerifiedAccessToken);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);

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
      const permissionsData = (res.data?.user as any)?.permissions || res.data?.user?.role?.permissions;

      if (accessToken && userData) {
        setAccessToken(accessToken);
        setUserData(userData);
        setVerifiedAccessToken(accessToken);
        if (permissionsData) {
          setPermissions(permissionsData);
        }
      }

      router.push(INDEX_ROUTE);
    },
    onError: toast.onError,
  });
};

interface UseSignoutMutationOptions {
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

export const useSignoutMutation = (options?: UseSignoutMutationOptions) => {
  const { t } = useLocaleContext();
  const removeAuthContext = useAuthMiddleware((s) => s.removeAuthContext);
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
      clearAccessToken();
      clearUserData();
      removeAuthContext();
      setRt((ps) => !ps);
      options?.onSuccess?.();
    },
    onError: (err) => {
      // Clear token & auth contexts anyway to avoid user being stuck on network errors
      clearAccessToken();
      clearUserData();
      removeAuthContext();
      setRt((ps) => !ps);
      options?.onError?.(err);
    },
  });
};

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: queryKeys.auth.profile(),
    queryFn: ({ signal }) => getUserProfile(signal),
  });
};
