"use client";

import { WithVNavsLayout } from "@/components/layout/with-v-navs-layout";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { usePathname } from "next/navigation";

// -----------------------------------------------------------------

const NAVS =
  OTHER_PRIVATE_NAV_GROUPS[0].navs.find((n) => n.path === "/settings")
    ?.children || [];
const ROOT_PATH = `/settings`;

// -----------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  // Hooks
  const pathname = usePathname();

  return (
    <WithVNavsLayout navs={NAVS} isAtSettingsIndex={pathname === ROOT_PATH}>
      {children}
    </WithVNavsLayout>
  );
}
