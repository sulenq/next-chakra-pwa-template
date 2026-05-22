"use client";

import { MainView, useMainViewContext } from "@/components/container/main-view";
import { VNavs } from "@/components/navigation/navs";
import { HelperText } from "@/components/ui/helper-text";
import { StackH, StackV } from "@/components/ui/stack";
import { APP } from "@/constants/_meta";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { NavGroup } from "@/types/global.types";
import { formatAbsDate } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

// -----------------------------------------------------------------

interface WithVNavsLayoutProps extends StackProps {
  navs: NavGroup[];
  rootPath: string;
}

export const WithVNavsLayout = (props: WithVNavsLayoutProps) => {
  // Props
  const { children, navs, rootPath, ...restProps } = props;

  // Hooks
  const pathname = usePathname();

  // Refs
  const { isSmContainer } = useMainViewContext();

  // Contexts
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Derived Values
  const isAtSettingsIndexRoute = pathname === rootPath;
  const showNavs = !isSmContainer || (isSmContainer && isAtSettingsIndexRoute);
  const showContent =
    !isSmContainer || (isSmContainer && !isAtSettingsIndexRoute);

  return (
    <MainView.Content className={"WithVNavsLayout"} {...restProps}>
      <StackH flex={1} w={"full"}>
        {/* Navs */}
        {showNavs && (
          <StackV
            flexShrink={0}
            w={isSmContainer ? "full" : "250px"}
            alignSelf={"flex-start"}
            maxH={"calc(100dvh - 80px)"}
            py={GAP}
            pl={GAP}
            overflowY={"auto"}
            pos={"sticky"}
            top={0}
          >
            <StackV
              flex={1}
              px={isSmContainer ? 2 : 0}
              pb={isSmContainer ? 2 : 0}
              rounded={theme.radii.container}
            >
              <MainView.Header
                withTitle
                title={t.settings}
                px={isSmContainer ? "6px" : R_SPACING_MD}
              />

              <StackV
                className={"scrollY"}
                flex={1}
                p={R_SPACING_MD}
                overflowY={"auto"}
              >
                <VNavs
                  navs={navs}
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
          <MainView.Root flex={1} p={GAP}>
            {pathname !== rootPath && <MainView.Header withTitle px={4} />}

            {children}
          </MainView.Root>
        )}
      </StackH>
    </MainView.Content>
  );
};
