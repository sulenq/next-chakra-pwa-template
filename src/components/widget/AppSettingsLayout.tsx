"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { LeftIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { RouteContainer } from "@/components/widget/RouteContainer";
import { OTHER_NAVS, PRIVATE_ROUTE_INDEX } from "@/constants/navs";
import useLang from "@/context/useLang";
import { useSettingsRouteContainer } from "@/context/useSettingsRouteContainer";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { pluckString } from "@/utils/string";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SETTINGS_NAVS = OTHER_NAVS[0].list[0].subMenus!;

export const AppSettingsLayout = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const pathname = usePathname();

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const size = useContainerDimension(containerRef);

  // Contexts
  const { l } = useLang();
  const setContainerRef = useSettingsRouteContainer((s) => s.setContainerRef);

  // States
  const isSmContainer = size.width < 720;
  const isAtSettingsIndexRoute = pathname === `${PRIVATE_ROUTE_INDEX}/settings`;
  const showSidebar =
    !isSmContainer || (isSmContainer && isAtSettingsIndexRoute);
  const showContent =
    !isSmContainer || (isSmContainer && !isAtSettingsIndexRoute);

  useEffect(() => {
    setContainerRef(containerRef);
  }, [setContainerRef]);

  return (
    <RouteContainer
      id="settings_route_container"
      ref={containerRef}
      p={0}
      {...restProps}
    >
      <HStack
        align={"stretch"}
        flex={1}
        gap={0}
        overflowY={"auto"}
        pl={showSidebar ? 4 : 0}
        pr={showContent ? 0 : 4}
      >
        {/* Sidebar */}
        {showSidebar && (
          <ItemContainer
            scrollY
            flexShrink={0}
            w={isSmContainer ? "full" : "250px"}
            p={"6px"}
            pr={0}
            mb={4}
          >
            {SETTINGS_NAVS.map((navItem, navItemIdx) => {
              return (
                <CContainer key={navItemIdx} gap={1}>
                  {navItem.groupLabelKey && (
                    <P
                      fontSize={"xs"}
                      fontWeight={"semibold"}
                      color={"fg.subtle"}
                      ml={"10px"}
                      mt={1}
                    >
                      {pluckString(l, navItem.groupLabelKey)}
                    </P>
                  )}

                  {navItem.list.map((nav) => {
                    const isActive = nav.path === pathname;

                    return (
                      <NavLink key={nav.path} to={nav.path}>
                        <Btn
                          clicky={false}
                          justifyContent={"start"}
                          variant={"ghost"}
                          px={2}
                          pos={"relative"}
                        >
                          {isActive && <LeftIndicator />}

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
        {showContent && (
          <CContainer className="scrollY" pl={4} pr={"calc(16px - 6px)"}>
            {children}
          </CContainer>
        )}
      </HStack>
    </RouteContainer>
  );
};
