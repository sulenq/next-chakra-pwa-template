"use client";

import { HelperText } from "@/components/ui/helper-text";
import { StackH, StackV } from "@/components/ui/stack";
import {
  ConstrainedContainer,
  MainView,
  useMainViewContext,
} from "@/components/widgets/main-view";
import { NavsV } from "@/components/widgets/navs";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
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
  const { isSmContainer } = useMainViewContext();

  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();

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
            rounded={themeContext.radii.container}
            overflowY={"auto"}
          >
            <MainView.Header
              withTitle
              title={t.settings}
              px={isSmContainer ? "6px" : R_SPACING_MD}
            />

            <StackV className={"scrollY"} flex={1} p={R_SPACING_MD}>
              <NavsV
                navs={NAVS}
                addonBottomElement={
                  <StackV mt={"auto"} gap={1}>
                    <HelperText>{`v${APP.version}`}</HelperText>

                    <HelperText>
                      {`Last updated: 
                        ${formatAbsDate(APP.lastUpdated, t, {
                          variant: "numeric",
                        })}`}
                    </HelperText>
                  </StackV>
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
        <MainView.Root className={"scrollY"} flex={1}>
          <ConstrainedContainer flex={1} p={GAP}>
            {pathname !== ROOT_PATH && <MainView.Header withTitle px={4} />}

            <StackV flex={1}>{children}</StackV>
          </ConstrainedContainer>
        </MainView.Root>
      )}
    </StackH>
  );
}
