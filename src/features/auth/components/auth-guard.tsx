import { VerifyingScreen } from "@/components/feedback/verifying-screen";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCurrentUser } from "../hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Constants
  const ENABLE_AUTH_GUARD =
    process.env.NEXT_PUBLIC_ENABLE_AUTH_GUARD === "true";

  // States
  const [isHydrated, setIsHydrated] = useState(false);

  // Stores
  const accessToken = useAuthStore((s) => s.auth.accessToken);
  const setAuth = useAuthStore((s) => s.setAuth);
  const removeAuth = useAuthStore((s) => s.removeAuth);

  // Hooks
  const router = useRouter();

  // Queries
  const { data, isPending, isError } = useCurrentUser({
    enabled: isHydrated && !!accessToken && ENABLE_AUTH_GUARD,
    retry: false,
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!data) return;

    const user = data.data?.user;
    if (user) {
      setAuth({
        user: user,
        role: user?.role,
        permissions: user?.role?.permissions,
      });
    }
  }, [data, setAuth]);

  useEffect(() => {
    if (!isHydrated || !ENABLE_AUTH_GUARD) return;

    if (!accessToken) {
      router.replace("/");
    }
  }, [accessToken, ENABLE_AUTH_GUARD, router, isHydrated]);

  useEffect(() => {
    if (!isHydrated || !ENABLE_AUTH_GUARD) return;

    if (isError) {
      removeAuth();
      router.replace("/");
    }
  }, [isError, ENABLE_AUTH_GUARD, router, removeAuth, isHydrated]);

  if (!ENABLE_AUTH_GUARD) return <>{children}</>;

  if (!isHydrated || !accessToken || isPending || isError) {
    return <VerifyingScreen />;
  }

  return <>{children}</>;
}
