import { VerifyingScreen } from "@/components/feedback/verifying-screen";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserProfile } from "../hooks/use-auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  // Constants
  const ENABLE_AUTH_GUARD =
    process.env.NEXT_PUBLIC_ENABLE_AUTH_GUARD === "true";

  // States
  const [isHydrated, setIsHydrated] = useState(false);

  // Store
  const accessToken = useAuthStore((s) => s.accessToken);
  const setRole = useAuthStore((s) => s.setRole);
  const setPermissions = useAuthStore((s) => s.setPermissions);
  const removeAuth = useAuthStore((s) => s.removeAuth);
  const setUser = useAuthStore((s) => s.setUser);

  // Hooks
  const router = useRouter();

  // Queries
  const { data, isPending, isError } = useUserProfile({
    enabled: isHydrated && !!accessToken && ENABLE_AUTH_GUARD,
    retry: false,
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!data) return;

    const user = data.data;
    if (user) {
      setUser(user);
      setRole(user?.role);
      setPermissions(user?.role?.permissions);
    }
  }, [data, setRole, setPermissions, setUser]);

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
