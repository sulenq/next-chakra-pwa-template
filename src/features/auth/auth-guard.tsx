import { VerifyingScreen } from "@/components/widgets/verifying-screen";
import { AUTH_API_USER_PROFILE } from "@/constants/apis";
import { useAuthMiddleware } from "@/contexts/useAuthMiddleware";
import { useRequest } from "@/hooks/useRequest";
import { getAccessToken, setAccessToken, setUserData } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const ENABLE_AUTH_GUARD =
    process.env.NEXT_PUBLIC_ENABLE_AUTH_GUARD === "true";

  const authToken = getAccessToken();
  const verifiedAccessToken = useAuthMiddleware((s) => s.verifiedAccessToken);
  const setRole = useAuthMiddleware((s) => s.setRole);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setVerifiedAccessToken = useAuthMiddleware(
    (s) => s.setVerifiedAccessToken,
  );

  const verificationStartedRef = useRef(false);

  const router = useRouter();

  const { req, loading } = useRequest({
    id: "user-profile",
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  if (!ENABLE_AUTH_GUARD) {
    return children;
  }

  if (!authToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  if (authToken && !verifiedAccessToken) {
    if (!verificationStartedRef.current) {
      verificationStartedRef.current = true;

      const config = { method: "GET", url: AUTH_API_USER_PROFILE };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            const user = r.data.data;
            setAccessToken(authToken);
            setUserData(user);
            setVerifiedAccessToken(authToken);
            setRole(user?.role);
            setPermissions(user?.role?.permissions);
          },
          onError: () => {
            setVerifiedAccessToken(null);
          },
        },
      });
    }

    return <VerifyingScreen />;
  }

  if (loading) {
    return <VerifyingScreen />;
  }

  if (!verifiedAccessToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  return children;
}
