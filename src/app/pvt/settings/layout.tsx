"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import { LeftIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { RouteContainer } from "@/components/widget/RouteContainer";
import { OTHER_NAVS, PRIVATE_ROUTE_INDEX } from "@/constants/navs";
import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX_NUMBER } from "@/constants/sizes";
import useLang from "@/context/useLang";
import { useSettingsRouteContainer } from "@/context/useSettingsRouteContainer";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { isEmptyArray } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SETTINGS_NAVS = OTHER_NAVS[0].list[0].subMenus!;

const SettingsNavsList = (props: any) => {
  // Props
  const { search } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const pathname = usePathname();

  // States
  const searchTerm = search.toLowerCase();
  const resolvedList = SETTINGS_NAVS.reduce<typeof SETTINGS_NAVS>(
    (acc, nav) => {
      const filteredItems = nav.list.filter((item) =>
        pluckString(l, item.labelKey).toLowerCase().includes(searchTerm)
      );

      if (filteredItems.length > 0) {
        acc.push({
          ...nav,
          list: filteredItems,
        });
      }

      return acc;
    },
    [] as typeof SETTINGS_NAVS
  );

  return (
    <>
      {isEmptyArray(resolvedList) && <FeedbackNotFound />}

      {!isEmptyArray(resolvedList) &&
        resolvedList.map((navItem, navItemIdx) => {
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

                      <P textAlign={"left"}>{pluckString(l, nav.labelKey)}</P>
                    </Btn>
                  </NavLink>
                );
              })}
            </CContainer>
          );
        })}
    </>
  );
};

const AppSettingsLayout = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
  const pathname = usePathname();

  // Refs
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerDimensions = useContainerDimension(containerRef);

  // Contexts
  const setContainerDimension = useSettingsRouteContainer(
    (s) => s.setContainerDimension
  );

  // States
  const [search, setSearch] = useState<string>("");
  const isSmContainer = containerDimensions.width < 720;
  const isAtSettingsIndexRoute = pathname === `${PRIVATE_ROUTE_INDEX}/settings`;
  const showSidebar =
    !isSmContainer || (isSmContainer && isAtSettingsIndexRoute);
  const showContent =
    !isSmContainer || (isSmContainer && !isAtSettingsIndexRoute);

  useEffect(() => {
    setContainerDimension(containerDimensions);
  }, [containerDimensions]);

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
          <CContainer
            flexShrink={0}
            w={isSmContainer ? "full" : "250px"}
            h={"fit"}
            maxH={"full"}
            pb={4}
            overflowY={"auto"}
          >
            <ItemContainer scrollY p={"6px"} pr={0}>
              <CContainer mb={1}>
                <SearchInput
                  inputProps={{ variant: "flushed", rounded: 0 }}
                  inputValue={search}
                  onChange={(inputValue) => {
                    setSearch(inputValue || "");
                  }}
                />
              </CContainer>

              <SettingsNavsList search={search} />
            </ItemContainer>
          </CContainer>
        )}

        {/* Content */}
        {showContent && (
          <CContainer
            className={"scrollY"}
            pl={4}
            pr={`calc(16px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX_NUMBER})`}
          >
            {children}
          </CContainer>
        )}
      </HStack>
    </RouteContainer>
  );
};

export default AppSettingsLayout;
