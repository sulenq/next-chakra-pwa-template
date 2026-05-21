import { VerifyingScreen } from "@/components/feedback/verifying-screen";
import { useAuthMiddleware } from "@/contexts/use-auth-middleware-context";
import { useRequest } from "@/hooks/useRequestOld";
import { getAccessToken, setAccessToken, setUserData } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useUserProfile } from "../hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Contexts
  const authToken = getAccessToken();
  const verifiedAccessToken = useAuthMiddleware((s) => s.verifiedAccessToken);
  const setRole = useAuthMiddleware((s) => s.setRole);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setVerifiedAccessToken = useAuthMiddleware(
    (s) => s.setVerifiedAccessToken,
  );

  // Hooks
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "user-profile",
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  // Refs
  const verificationStartedRef = useRef(false);

  // Constants
  const ENABLE_AUTH_GUARD =
    process.env.NEXT_PUBLIC_ENABLE_AUTH_GUARD === "true";

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

      const config = { method: "GET", url: "" };

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
