"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { RouteContainer } from "@/components/widget/RouteContainer";
import { OTHER_NAVS, PRIVATE_ROUTE_INDEX } from "@/constants/navs";
import useLang from "@/context/useLang";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { pluckString } from "@/utils/string";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";

const SETTINGS_NAVS = OTHER_NAVS[0].list[0].subMenus!;

export const AppSettingsLayout = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const pathname = usePathname();
  const iss = useIsSmScreenWidth();

  // Contexts
  const { l } = useLang();

  // States
  const isAtSettingsIndexRoute = pathname === `${PRIVATE_ROUTE_INDEX}/settings`;
  const showSidebar = !iss || (iss && isAtSettingsIndexRoute);
  const showContent = !iss || (iss && !isAtSettingsIndexRoute);

  return (
    <RouteContainer id={"settings_container"} {...restProps}>
      <HStack align={"stretch"} flex={1} gap={4}>
        {/* Sidebar */}
        {showSidebar && (
          <ItemContainer
            scrollY
            flexShrink={0}
            w={["full", null, "250px"]}
            p={"6px"}
            pr={0}
          >
            {SETTINGS_NAVS.map((navItem, navItemIdx) => {
              return (
                <CContainer key={navItemIdx} gap={1}>
                  {navItem.groupLabelKey && (
                    <P
                      fontSize={"xs"}
                      fontWeight={"semibold"}
                      color={"fg.subtle"}
                      ml={2}
                      mt={"2px"}
                    >
                      {pluckString(l, navItem.groupLabelKey)}
                    </P>
                  )}

                  {navItem.list.map((nav) => {
                    return (
                      <NavLink key={nav.path} to={nav.path}>
                        <Btn
                          clicky={false}
                          justifyContent={"start"}
                          variant={"ghost"}
                          px={2}
                        >
                          <Icon boxSize={5}>
                            <nav.icon stroke={1.5} />
                          </Icon>

                          <P textAlign={"left"}>
                            {pluckString(l, nav.labelKey)}
                          </P>
                        </Btn>
                      </NavLink>
                    );
                  })}
                </CContainer>
              );
            })}
          </ItemContainer>
        )}

        {/* Content */}
        {showContent && <ItemContainer h={"full"}>{children}</ItemContainer>}
      </HStack>
    </RouteContainer>
  );
};
