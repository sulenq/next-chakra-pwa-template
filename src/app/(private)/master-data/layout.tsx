"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { StackH, StackV } from "@/components/ui/stack";
import { DesktopNavs } from "@/components/widgets/navs";
import {
  ConstrainedContainer,
  View,
  useViewContext,
} from "@/components/widgets/view";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { formatAbsDate } from "@/utils/formatter";
import { usePathname } from "next/navigation";

const NAVS =
  OTHER_PRIVATE_NAV_GROUPS[0].navs.find((n) => n.path === "/master-data")
    ?.children || [];
const ROOT_PATH = `/master-data`;

// -----------------------------------------------------------------

export default function Layout({ children }: { children: React.ReactNode }) {
  // Hooks
  const pathname = usePathname();

  // Refs
  const { isSmContainer } = useViewContext();

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Derived Values
  const isAtSettingsIndexRoute = pathname === ROOT_PATH;
  const showSidebar =
    !isSmContainer || (isSmContainer && isAtSettingsIndexRoute);
  const showContent =
    !isSmContainer || (isSmContainer && !isAtSettingsIndexRoute);

  return (
    <StackH flex={1} w={"full"} overflowY={"auto"} pos={"relative"}>
      {/* Sidebar */}
      {showSidebar && (
        <StackV
          flexShrink={0}
          w={isSmContainer ? "full" : "250px"}
          h={"full"}
          py={GAP}
          pl={GAP}
          overflowY={"auto"}
        >
          <StackV
            flex={1}
            px={isSmContainer ? 2 : 0}
            pb={isSmContainer ? 2 : 0}
            rounded={themeConfig.radii.container}
            overflowY={"auto"}
          >
            <View.Header
              withTitle
              title={t.settings}
              px={isSmContainer ? "6px" : R_SPACING_MD}
            />

            <StackV className={"scrollY"} flex={1} p={R_SPACING_MD}>
              <DesktopNavs
                navs={NAVS}
                addonElement={
                  <CContainer mt={"auto"} gap={1}>
                    <HelperText>{`v${APP.version}`}</HelperText>

                    <HelperText>
                      {`Last updated: 
                        ${formatAbsDate(APP.lastUpdated, t, {
                          variant: "numeric",
                        })}`}
                    </HelperText>
                  </CContainer>
                }
                navsExpanded
                showGroupLabel
                flex={1}
              />
            </StackV>
          </StackV>
        </StackV>
      )}

      {/* Content */}
      {showContent && (
        <View.Root className={"scrollY"} flex={1}>
          <ConstrainedContainer flex={1} p={GAP}>
            {pathname !== ROOT_PATH && <View.Header withTitle px={4} />}

            <CContainer flex={1}>{children}</CContainer>
          </ConstrainedContainer>
        </View.Root>
      )}
    </StackH>
  );
}
