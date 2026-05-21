import { VerifyingScreen } from "@/components/feedback/verifying-screen";
import { useAuthMiddlewareContext } from "@/contexts/use-auth-middleware-context";
import { getAccessToken, setAccessToken, setUserData } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserProfile } from "../hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Constants
  const ENABLE_AUTH_GUARD =
    process.env.NEXT_PUBLIC_ENABLE_AUTH_GUARD === "true";

  // Contexts
  const authToken = getAccessToken();
  const verifiedAccessToken = useAuthMiddlewareContext(
    (s) => s.verifiedAccessToken,
  );
  const setRole = useAuthMiddlewareContext((s) => s.setRole);
  const setPermissions = useAuthMiddlewareContext((s) => s.setPermissions);
  const setVerifiedAccessToken = useAuthMiddlewareContext(
    (s) => s.setVerifiedAccessToken,
  );

  // Hooks
  const router = useRouter();

  // Queries
  const { data, isPending, isError } = useUserProfile({
    enabled: !!authToken && ENABLE_AUTH_GUARD,
  });

  useEffect(() => {
    if (!data) return;

    const user = data.data;
    if (user) {
      setAccessToken(authToken!);
      setUserData(user);
      setVerifiedAccessToken(authToken!);
      setRole(user?.role);
      setPermissions(user?.role?.permissions);
    }
  }, [data]);

  if (!ENABLE_AUTH_GUARD) return children;

  if (!authToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  if (isPending) return <VerifyingScreen />;

  if (isError) {
    setVerifiedAccessToken(null);
    router.replace("/");
    return <VerifyingScreen />;
  }

  if (!verifiedAccessToken) return <VerifyingScreen />;

  return children;
}
