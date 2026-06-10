"use client";

import { MainView, useMainViewContext } from "@/components/container/main-view";
import { VNavs } from "@/components/navigation/nav";
import { StackH, StackV } from "@/components/ui/stack";
import { HelperText } from "@/components/ui/typography";
import { APP } from "@/constants/_meta";
import { PADDING_MD, SPACING_MD } from "@/constants/styles";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { NavGroup } from "@/types/global.types";
import { formatAbsDate } from "@/utils/formatter";
import { cssCalc } from "@/utils/style";
import { Box, StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface WithVNavsLayoutProps extends StackProps {
  navs: NavGroup[];
  isAtSettingsIndex?: boolean;
}

export const WithVNavsLayout = (props: WithVNavsLayoutProps) => {
  // Props
  const { children, navs, isAtSettingsIndex, ...restProps } = props;

  // Refs
  const { isSmContainer } = useMainViewContext();

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Derived Values
  const showNavs = !isSmContainer || (isSmContainer && isAtSettingsIndex);
  const showContent = !isSmContainer || (isSmContainer && !isAtSettingsIndex);

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
                px={isSmContainer ? "6px" : SPACING_MD}
              />

              <StackV
                className={"scrollY"}
                flex={1}
                p={SPACING_MD}
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
          <MainView.Root flex={1} pb={[SPACING_MD]}>
            {!isAtSettingsIndex && (
              <Box
                px={[
                  cssCalc(`${SPACING_MD} + ${PADDING_MD}`),
                  null,
                  SPACING_MD,
                ]}
              >
                <MainView.Header withTitle />
              </Box>
            )}

            {children}
          </MainView.Root>
        )}
      </StackH>
    </MainView.Content>
  );
};
