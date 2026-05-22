import { VerifyingScreen } from "@/components/feedback/verifying-screen";
import { useAuthStore } from "@/stores/use-auth-store";
import { setUserData } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUserProfile } from "../hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Constants
  const ENABLE_AUTH_GUARD =
    process.env.NEXT_PUBLIC_ENABLE_AUTH_GUARD === "true";

  // Store
  const accessToken = useAuthStore((s) => s.accessTokenContext);
  const setRole = useAuthStore((s) => s.setRole);
  const setPermissions = useAuthStore((s) => s.setPermissions);
  const setAccessTokenContext = useAuthStore((s) => s.setAccessTokenContext);

  // Hooks
  const router = useRouter();

  // Queries
  const { data, isPending, isError } = useUserProfile({
    enabled: !!accessToken && ENABLE_AUTH_GUARD,
  });

  useEffect(() => {
    if (!data) return;

    const user = data.data;
    if (user) {
      setUserData(user);
      setRole(user?.role);
      setPermissions(user?.role?.permissions);
    }
  }, [data]);

  if (!ENABLE_AUTH_GUARD) return children;

  if (!accessToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  if (isPending) return <VerifyingScreen />;

  if (isError) {
    setAccessTokenContext(null);
    router.replace("/");
    return <VerifyingScreen />;
  }

  return children;
}
