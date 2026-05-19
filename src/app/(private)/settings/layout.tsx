"use client";

import { WithNavsVLayout } from "@/components/layout/with-navs-v-layout";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";

// -----------------------------------------------------------------

const NAVS =
  OTHER_PRIVATE_NAV_GROUPS[0].navs.find((n) => n.path === "/settings")
    ?.children || [];
const ROOT_PATH = `/settings`;

// -----------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <WithNavsVLayout navs={NAVS} rootPath={ROOT_PATH}>
      {children}
    </WithNavsVLayout>
  );
}
