"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { ClampText } from "@/components/widget/ClampText";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import { LucideIcon } from "@/components/widget/Icon";
import { LeftIndicator } from "@/components/widget/Indicator";
import { PageContainer, PageTitle } from "@/components/widget/PageShell";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { Props__Layout } from "@/constants/props";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useLang from "@/context/useLang";
import { useMasterDataPageContainer } from "@/context/useMasterDataPageContainer";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { isEmptyArray } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { HStack, Icon } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAVS =
  OTHER_PRIVATE_NAV_GROUPS[0].navs.find((n) => n.path === "/master-data")
    ?.children || [];
const ROOT_PATH = `/master-data`;

const NavsList = (props: any) => {
  // Props
  const { search, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const pathname = usePathname();

  // States
  const searchTerm = search.toLowerCase();
  const resolvedList = NAVS.reduce<typeof NAVS>(
    (acc, group) => {
      const filteredItems = group.navs.filter((item) =>
        pluckString(l, item.labelKey).toLowerCase().includes(searchTerm),
      );

      if (filteredItems.length > 0) {
        acc.push({
          ...group,
          navs: filteredItems,
        });
      }

      return acc;
    },
    [] as typeof NAVS,
  );

  return (
    <CContainer gap={4} {...restProps}>
      {isEmptyArray(resolvedList) && <FeedbackNotFound />}

      {!isEmptyArray(resolvedList) &&
        resolvedList.map((navItem, navItemIdx) => {
          return (
            <CContainer key={navItemIdx} gap={1}>
              {navItem.labelKey && (
                <P
                  fontSize={"sm"}
                  fontWeight={"semibold"}
                  color={"fg.subtle"}
                  ml={1}
                >
                  {pluckString(l, navItem.labelKey)}
                </P>
              )}

              {navItem.navs.map((nav) => {
                const isActive = nav.path === pathname;

                return (
                  <NavLink key={nav.path} to={nav.path} w={"full"}>
                    <Btn
                      clicky={false}
                      justifyContent={"start"}
                      variant={"ghost"}
                      px={2}
                      pos={"relative"}
                    >
                      {isActive && <LeftIndicator />}

                      <Icon boxSize={BASE_ICON_BOX_SIZE}>
                        <LucideIcon icon={nav.icon} />
                      </Icon>

                      <P textAlign={"left"}>{pluckString(l, nav.labelKey)}</P>
                    </Btn>
                  </NavLink>
                );
              })}
            </CContainer>
          );
        })}
    </CContainer>
  );
};

export default function Layout(props: Props__Layout) {
  // Props
  const { children } = props;

  // Hooks
  const pathname = usePathname();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const containerDimension = useContainerDimension(containerRef);

  // Contexts
  const setContainerDimension = useMasterDataPageContainer(
    (s) => s.setContainerDimension,
  );

  // States
  const [search, setSearch] = useState<string>("");
  const isSmContainer = containerDimension.width < 720;
  const isAtSettingsIndexRoute = pathname === ROOT_PATH;
  const showSidebar =
    !isSmContainer || (isSmContainer && isAtSettingsIndexRoute);
  const showContent =
    !isSmContainer || (isSmContainer && !isAtSettingsIndexRoute);

  useEffect(() => {
    setContainerDimension(containerDimension);
  }, [containerDimension]);

  return (
    <PageContainer id="settings_page_container" ref={containerRef} p={0}>
      {containerDimension.width > 0 && (
        <HStack align={"stretch"} flex={1} gap={0} overflowY={"auto"}>
          {/* Sidebar */}
          {showSidebar && (
            <CContainer
              flexShrink={0}
              w={isSmContainer ? "full" : "250px"}
              h={"full"}
              maxH={"full"}
              overflowY={"auto"}
              // borderRight={isSmContainer ? "" : "1px solid"}
              borderColor={"border.muted"}
            >
              <CContainer px={4} pt={3} pb={1}>
                <ClampText fontSize={"xl"} fontWeight={"semibold"}>
                  Master Data
                </ClampText>
              </CContainer>

              <CContainer p={3} pb={1}>
                <SearchInput
                  inputValue={search}
                  onChange={(inputValue) => {
                    setSearch(inputValue || "");
                  }}
                  queryKey={"q_master_data_navs"}
                />
              </CContainer>

              <NavsList search={search} p={3} />
            </CContainer>
          )}

          {/* Content */}
          {showContent && (
            <CContainer className={"scrollY"} flex={1}>
              {pathname !== ROOT_PATH && <PageTitle mb={1} />}

              <CContainer flex={1}>{children}</CContainer>
            </CContainer>
          )}
        </HStack>
      )}
    </PageContainer>
  );
}
