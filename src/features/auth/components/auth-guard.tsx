import { VerifyingScreen } from "@/components/feedback/verifying-screen";
import { useAuthStore } from "@/stores/use-auth-store";
import { setUser } from "@/utils/auth";
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
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

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
      setUser(user);
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
    setAccessToken(null);
    router.replace("/");
    return <VerifyingScreen />;
  }

  return children;
}
