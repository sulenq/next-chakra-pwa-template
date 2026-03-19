"use client";

import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Clock } from "@/components/widgets/clock";
import { HScroll } from "@/components/widgets/h-scroll";
import { BottomIndicator, LeftIndicator } from "@/components/widgets/indicator";
import { Logo } from "@/components/widgets/logo";
import { MContainer } from "@/components/widgets/m-container";
import {
  DesktopNavs,
  DesktopNavTooltip,
  UserPanel,
  MobileNavLink,
} from "@/components/widgets/navs";
import { ProfileMenuTrigger } from "@/components/widgets/profile-menu";
import { Today } from "@/components/widgets/today";
import { NavBreadcrumb, TopBar } from "@/components/widgets/view";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS, PRIVATE_NAV_GROUPS } from "@/constants/navs";
import {
  DESKTOP_ACTIVE_NAV_BTN_VARIANT,
  DESKTOP_NAV_BTN_ICON_BG,
  DESKTOP_NAV_BTN_PX,
  DESKTOP_NAV_BTN_SIZE,
  DESKTOP_NAV_BTN_VARIANT,
  DESKTOP_NAVS_COLOR,
  GAP,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  MOBILE_NAVS_COLOR,
  MOBILE_POPOVER_MAIN_AXIS,
  R_SPACING_MD,
  USER_PANEL_H,
} from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import useNavs from "@/contexts/useNavs";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { AuthGuard } from "@/features/auth/auth-guard";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { useScreen } from "@/hooks/useScreen";
import { last } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { Center, HStack, useBreakpointValue, VStack } from "@chakra-ui/react";
import { ChevronsLeftIcon, ChevronsRightIcon, ServerIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const MobileLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();

  // Hooks
  const pathname = usePathname();
  const { sw } = useScreen();

  // States
  const user = getUserData();
  const activeNavs = getActiveNavs(pathname);
  const resolvedActiveNavs =
    sw < 360 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;
  const isInProfileRoute = pathname.includes(`/profile`);

  return (
    <CContainer flex={1} overflowY={"auto"} {...restProps}>
      {/* Content */}
      <CContainer flex={1} bg={MOBILE_CONTENT_CONTAINER_BG} overflowY={"auto"}>
        {/* Content header */}
        <CContainer gap={2}>
          <HStack w={"full"} justify={"space-between"} pt={2} px={4}>
            <HStack>
              <Logo size={15} ml={"-4px"} />
            </HStack>

            <HStack>
              <Clock fontSize={"sm"} showTimezone={sw > 320} />

              <Today fontSize={"sm"} />
            </HStack>
          </HStack>

          <HStack
            gap={4}
            px={4}
            pb={2}
            borderBottom={"1px solid"}
            borderColor={"border.muted"}
            justify={"space-between"}
          >
            <NavBreadcrumb
              backPath={backPath}
              resolvedActiveNavs={resolvedActiveNavs}
              ml={backPath ? -2 : -1}
            />
          </HStack>
        </CContainer>

        {children}
      </CContainer>

      {/* Navs */}
      <HScroll
        bg={"bg.body"}
        borderTop={"1px solid"}
        borderColor={"border.subtle"}
      >
        <HStack w={"max"} gap={4} px={4} pt={3} pb={5} mx={"auto"}>
          {PRIVATE_NAV_GROUPS.map((group, idx) => {
            return (
              <Fragment key={idx}>
                {group.navs.map((nav) => {
                  const isMainNavActive = pathname.includes(nav.path);

                  return (
                    <Fragment key={nav.path}>
                      {!nav.children && (
                        <MobileNavLink
                          key={nav.path}
                          to={nav.children ? "" : nav.path}
                          color={isMainNavActive ? "" : "fg.muted"}
                          flex={1}
                        >
                          <AppIconLucide icon={nav.icon} />

                          <P
                            textAlign={"center"}
                            lineClamp={1}
                            fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                          >
                            {nav.label ?? pluckString(t, nav.labelKey) ?? "-"}
                          </P>

                          {isMainNavActive && <BottomIndicator />}
                        </MobileNavLink>
                      )}

                      {nav.children && (
                        <>
                          <MenuRoot
                            positioning={{
                              placement: "top",
                              offset: {
                                mainAxis: MOBILE_POPOVER_MAIN_AXIS,
                              },
                            }}
                          >
                            <MenuTrigger asChild>
                              <CContainer
                                key={nav.path}
                                minW={"50px"}
                                align={"center"}
                                gap={1}
                                color={isMainNavActive ? "" : "fg.muted"}
                                pos={"relative"}
                                cursor={"pointer"}
                                flex={1}
                              >
                                <AppIconLucide icon={nav.icon} />

                                <P
                                  fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                                  textAlign={"center"}
                                  lineClamp={1}
                                >
                                  {nav.label ??
                                    pluckString(t, nav.labelKey) ??
                                    "-"}
                                </P>

                                {isMainNavActive && <BottomIndicator />}
                              </CContainer>
                            </MenuTrigger>

                            <MenuContent>
                              {nav.children.map((subGroup, idx) => {
                                return (
                                  <MenuItemGroup
                                    key={idx}
                                    title={
                                      subGroup.labelKey
                                        ? pluckString(t, subGroup.labelKey)
                                        : ""
                                    }
                                  >
                                    {subGroup.navs.map((subNav) => {
                                      const isSubNavsActive =
                                        pathname === subNav.path;

                                      return (
                                        <NavLink
                                          key={subNav.path}
                                          w={"full"}
                                          to={subNav.path}
                                        >
                                          <MenuItem
                                            value={subNav.path}
                                            h={"44px"}
                                            px={3}
                                          >
                                            {isSubNavsActive && (
                                              <LeftIndicator />
                                            )}

                                            <P lineClamp={1}>
                                              {subNav.label ??
                                                pluckString(
                                                  t,
                                                  subNav.labelKey,
                                                ) ??
                                                "-"}
                                            </P>
                                          </MenuItem>
                                        </NavLink>
                                      );
                                    })}
                                  </MenuItemGroup>
                                );
                              })}
                            </MenuContent>
                          </MenuRoot>
                        </>
                      )}
                    </Fragment>
                  );
                })}
              </Fragment>
            );
          })}

          {OTHER_PRIVATE_NAV_GROUPS.find(
            (group) => group.labelKey === "other",
          )?.navs.map((nav) => {
            return (
              <MobileNavLink
                key={nav.path}
                to={nav.path}
                color={pathname === nav.path ? "" : MOBILE_NAVS_COLOR}
                flex={1}
              >
                <AppIconLucide icon={nav.icon} />

                <P
                  textAlign={"center"}
                  lineClamp={1}
                  fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                >
                  {nav.label ?? pluckString(t, nav.labelKey) ?? "-"}
                </P>

                {pathname === nav.path && <BottomIndicator />}
              </MobileNavLink>
            );
          })}

          <ProfileMenuTrigger flex={1} w={"50px"}>
            <VStack
              flex={1}
              color={MOBILE_NAVS_COLOR}
              cursor={"pointer"}
              gap={1}
            >
              <Avatar
                src={imgUrl(user?.avatar?.[0]?.filePath)}
                name={user?.name}
                size={"2xs"}
              />

              <P
                fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                textAlign={"center"}
                color={isInProfileRoute ? "" : MOBILE_NAVS_COLOR}
                lineClamp={1}
              >
                {t.profile}
              </P>
            </VStack>
          </ProfileMenuTrigger>
        </HStack>
      </HScroll>
    </CContainer>
  );
};

const DesktopLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();
  const isNavsExpanded = useNavs((s) => s.isNavsExpanded);
  const toggleNavsExpanded = useNavs((s) => s.toggleNavsExpanded);

  // Hooks
  const pathname = usePathname();

  // SX
  const rSpacingMd = useBreakpointValue(R_SPACING_MD);

  return (
    <StackV w={"full"} h={`calc(100svh)`} overflowY={"auto"}>
      <StackH
        flex={1}
        w={"full"}
        overflowY={"auto"}
        pos={"relative"}
        zIndex={2}
        {...restProps}
      >
        {/* Sidebar */}
        <StackV
          flexShrink={0}
          w={
            isNavsExpanded
              ? `calc(250px + (${rSpacingMd} * 2) + ${GAP})`
              : `calc(36px + (${rSpacingMd} * 2) + ${GAP})`
          }
          transition={"300ms"}
          pos={"relative"}
        >
          {/* Content */}
          <StackV
            flex={1}
            gap={GAP}
            pl={GAP}
            py={GAP}
            overflowY={"auto"}
            overflowX={"clip"}
          >
            {/* Header */}
            <StackH align={"center"} gap={3} minH={"60px"} p={R_SPACING_MD}>
              <Logo ml={"4px"} />

              {isNavsExpanded && (
                <P lineClamp={1} fontSize={"lg"} fontWeight={"semibold"}>
                  {APP.name}
                </P>
              )}
            </StackH>

            {/* Toggle Expand */}
            <DesktopNavTooltip
              content={isNavsExpanded ? t.minimize : t.maximize}
            >
              <StackH px={R_SPACING_MD} my={GAP}>
                <Btn
                  flex={1}
                  clicky={false}
                  aria-label={"toggle expand navs"}
                  size={DESKTOP_NAV_BTN_SIZE}
                  variant={DESKTOP_NAV_BTN_VARIANT}
                  justifyContent={"start"}
                  gap={4}
                  px={DESKTOP_NAV_BTN_PX}
                  zIndex={99}
                  transition={"300ms"}
                  onClick={toggleNavsExpanded}
                >
                  <Center
                    p={2}
                    bg={DESKTOP_NAV_BTN_ICON_BG}
                    rounded={themeConfig.radii.component}
                  >
                    <AppIconLucide
                      icon={
                        isNavsExpanded ? ChevronsLeftIcon : ChevronsRightIcon
                      }
                    />
                  </Center>

                  {isNavsExpanded && (
                    <P>{isNavsExpanded ? t.minimize : t.maximize}</P>
                  )}
                </Btn>
              </StackH>
            </DesktopNavTooltip>

            {/* Navs */}
            <StackV flex={1} overflowY={"auto"} pos={"relative"}>
              <StackV
                className={"noScroll"}
                flex={1}
                px={R_SPACING_MD}
                pt={R_SPACING_MD}
                pb={
                  isNavsExpanded
                    ? `calc(${USER_PANEL_H} + ${rSpacingMd})`
                    : `cacl(36px + ${rSpacingMd})`
                }
                mb={GAP}
                overflowY={"auto"}
              >
                <DesktopNavs
                  navs={PRIVATE_NAV_GROUPS}
                  navsExpanded={isNavsExpanded}
                  addonElement={
                    <CContainer gap={1} mt={"auto"}>
                      <NavLink
                        key={"/master-data"}
                        to={"/master-data"}
                        w={"full"}
                      >
                        <DesktopNavTooltip
                          content={pluckString(t, "navs.master_data")}
                        >
                          <Btn
                            clicky={false}
                            justifyContent={isNavsExpanded ? "start" : "start"}
                            gap={4}
                            px={DESKTOP_NAV_BTN_PX}
                            size={DESKTOP_NAV_BTN_SIZE}
                            variant={
                              pathname.includes("/master-data")
                                ? DESKTOP_ACTIVE_NAV_BTN_VARIANT
                                : DESKTOP_NAV_BTN_VARIANT
                            }
                            colorPalette={
                              pathname.includes("/master-data")
                                ? themeConfig.colorPalette
                                : ""
                            }
                            pos={"relative"}
                          >
                            {/* {pathname.includes("/master-data") && (
                            <LeftIndicator />
                          )} */}

                            <Center
                              p={2}
                              bg={
                                pathname.includes("/master-data")
                                  ? ""
                                  : DESKTOP_NAV_BTN_ICON_BG
                              }
                              rounded={"full"}
                            >
                              <AppIconLucide
                                icon={ServerIcon}
                                color={
                                  pathname.includes("/master-data")
                                    ? ""
                                    : DESKTOP_NAVS_COLOR
                                }
                              />
                            </Center>

                            {isNavsExpanded && (
                              <P lineClamp={1} textAlign={"left"}>
                                {pluckString(t, "navs.master_data")}
                              </P>
                            )}
                          </Btn>
                        </DesktopNavTooltip>
                      </NavLink>
                    </CContainer>
                  }
                  flex={1}
                />
              </StackV>

              <StackV
                w={"full"}
                pos={"absolute"}
                left={0}
                bottom={0}
                zIndex={2}
              >
                <UserPanel navsExpanded={isNavsExpanded} />
              </StackV>
            </StackV>
          </StackV>
        </StackV>

        {/* Content */}
        <StackV w={"full"} overflowY={"auto"}>
          <StackV px={GAP} pt={GAP}>
            <StackV p={R_SPACING_MD}>
              <TopBar />
            </StackV>
          </StackV>

          <MContainer flex={1} overflow={"auto"}>
            {children}
          </MContainer>
        </StackV>
      </StackH>
    </StackV>
  );
};

export default function Layout(props: any) {
  const iss = useIsSmScreenWidth();

  return (
    <AuthGuard>
      <CContainer id="app-layout" h={"100dvh"}>
        {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      </CContainer>
    </AuthGuard>
  );
}
