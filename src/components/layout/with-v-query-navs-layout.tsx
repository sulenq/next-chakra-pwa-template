"use client";

import { MainView, useMainViewContext } from "@/components/container/main-view";
import { VNavs } from "@/components/navigation/nav";
import { StackH, StackV } from "@/components/ui/stack";
import { HelperText } from "@/components/ui/typography";
import { APP } from "@/constants/_meta";
import { SPACING_MD, TOP_BAR_H } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { NavGroup } from "@/types/global.types";
import { formatAbsDate } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";
import { P } from "../ui/p";

// -----------------------------------------------------------------

interface NavsProps {
  navs: NavGroup[];
}

const Navs = (props: NavsProps) => {
  // Props
  const { navs, ...restProps } = props;

  // Refs
  const { isSmContainer } = useMainViewContext();

  // Stores
  const { t } = useLocaleStore();

  return (
    <StackV
      flexShrink={0}
      w={isSmContainer ? "full" : "250px"}
      bg={"bg.body"}
      overflowY={"auto"}
      {...restProps}
    >
      <StackV flex={1} px={isSmContainer ? 2 : 0} pb={isSmContainer ? 2 : 0}>
        <StackH align={"center"} h={TOP_BAR_H} p={SPACING_MD}>
          <P fontWeight={"medium"} textAlign={"center"} mx={"auto"}>
            {t.settings}
          </P>
        </StackH>

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
  );
};

// -----------------------------------------------------------------

interface WithVQueryNavsLayoutProps extends StackProps {
  navs: NavGroup[];
}

export const WithVQueryNavsLayout = (props: WithVQueryNavsLayoutProps) => {
  // Props
  const { children, navs, ...restProps } = props;

  // Derived Values
  const showNavs = true;
  const showContent = true;

  return (
    <StackH flex={1} w={"full"} {...restProps}>
      {/* Navs */}
      {showNavs && <Navs navs={navs} />}

      {/* Content */}
      {showContent && (
        <MainView.Root flex={1}>
          <StackH></StackH>

          {children}
        </MainView.Root>
      )}
    </StackH>
  );
};
