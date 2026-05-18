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
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import { NavGroup } from "@/types/global.types";
import { formatAbsDate } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

// -----------------------------------------------------------------

interface WithSidenavLayoutProps extends StackProps {
  navs: NavGroup[];
  rootPath: string;
}

export const WithSidenavLayout = (props: WithSidenavLayoutProps) => {
  // Props
  const { children, navs, rootPath, ...restProps } = props;

  // Hooks
  const pathname = usePathname();

  // Refs
  const { isSmContainer } = useMainViewContext();

  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();

  // Derived Values
  const isAtSettingsIndexRoute = pathname === rootPath;
  const showSidebar =
    !isSmContainer || (isSmContainer && isAtSettingsIndexRoute);
  const showContent =
    !isSmContainer || (isSmContainer && !isAtSettingsIndexRoute);

  return (
    <ConstrainedContainer flex={1} overflowY={"auto"}>
      <StackH
        flex={1}
        w={"full"}
        overflowY={"auto"}
        pos={"relative"}
        {...restProps}
      >
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
                  navs={navs}
                  addonElement={
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
            {pathname !== rootPath && <MainView.Header withTitle px={4} />}

            <StackV flex={1}>{children}</StackV>
          </MainView.Root>
        )}
      </StackH>
    </ConstrainedContainer>
  );
};
