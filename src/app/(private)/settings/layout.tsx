"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widgets/app-icon";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { LeftIndicator } from "@/components/widgets/indicator";
import { MContainer } from "@/components/widgets/m-container";
import {
  ContainerLayout,
  PageContainer,
  PageHeader,
} from "@/components/widgets/page-shell";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS } from "@/constants/navs";
import { DESKTOP_NAVS_TOOLTIP_MAIN_AXIS } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useSettingsPageContainer } from "@/contexts/useSettingsPageContainer";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { isEmptyArray } from "@/utils/array";
import { formatAbsDate } from "@/utils/formatter";
import { pluckString } from "@/utils/string";
import { HStack } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAVS =
  OTHER_PRIVATE_NAV_GROUPS[0].navs.find((n) => n.path === "/settings")
    ?.children || [];
const NAVS_COLOR = "ibody";
const ROOT_PATH = `/settings`;

const NavsList = (props: any) => {
  // Props
  const { search, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  // Hooks
  const pathname = usePathname();

  // States
  const searchTerm = search.toLowerCase();
  const resolvedList = NAVS.reduce<typeof NAVS>(
    (acc, group) => {
      const filteredItems = group.navs.filter((item) =>
        pluckString(t, item.labelKey).toLowerCase().includes(searchTerm),
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
                  {pluckString(t, navItem.labelKey)}
                </P>
              )}

              {navItem.navs.map((nav) => {
                const isActive = nav.path === pathname;

                return (
                  <Tooltip
                    key={nav.path}
                    content={pluckString(t, nav.labelKey)}
                    positioning={{
                      placement: "right",
                      offset: {
                        mainAxis: DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
                      },
                    }}
                  >
                    <NavLink to={nav.path} w={"full"}>
                      <Btn
                        clicky={false}
                        justifyContent={"start"}
                        variant={"ghost"}
                        px={2}
                        color={isActive ? "" : NAVS_COLOR}
                        pos={"relative"}
                      >
                        {isActive && <LeftIndicator />}

                        <AppIcon icon={nav.icon} />

                        <P textAlign={"left"}>{pluckString(t, nav.labelKey)}</P>
                      </Btn>
                    </NavLink>
                  </Tooltip>
                );
              })}
            </CContainer>
          );
        })}
    </CContainer>
  );
};

export default function Layout(props: any) {
  // Hooks
  const pathname = usePathname();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const containerDimension = useContainerDimension(containerRef);

  // Contexts
  const { t } = useLocale();
  const setContainerDimension = useSettingsPageContainer(
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
    <PageContainer id="settings-route-container" ref={containerRef} p={0}>
      {containerDimension.width > 0 && (
        <HStack align={"stretch"} flex={1} gap={0} overflowY={"auto"}>
          {/* Sidebar */}
          {showSidebar && (
            <CContainer
              flexShrink={0}
              w={isSmContainer ? "full" : "250px"}
              h={"full"}
              maxH={"full"}
              // borderRight={isSmContainer ? "" : "1px solid"}
              borderColor={"border.muted"}
              overflowY={"auto"}
            >
              <PageHeader title={t.settings} />

              <CContainer px={3} py={2}>
                <SearchInput
                  queryKey={"q-settings-navs"}
                  inputValue={search}
                  onChange={(inputValue) => {
                    setSearch(inputValue || "");
                  }}
                />
              </CContainer>

              <MContainer className={"scrollY"} flex={1}>
                <NavsList search={search} px={3} py={2} />

                <CContainer p={4} mt={"auto"} gap={1}>
                  <HelperText>{`v${APP.version}`}</HelperText>

                  <HelperText>
                    {`Last updated: 
                ${formatAbsDate(APP.lastUpdated, t, {
                  variant: "numeric",
                })}`}
                  </HelperText>
                </CContainer>
              </MContainer>
            </CContainer>
          )}

          {/* Content */}
          {showContent && (
            <MContainer className={"scrollY"} flex={1}>
              <ContainerLayout
                flex={1}
                // maxW={""}
              >
                {pathname !== ROOT_PATH && <PageHeader />}

                <CContainer flex={1} {...props} />
              </ContainerLayout>
            </MContainer>
          )}
        </HStack>
      )}
    </PageContainer>
  );
}
