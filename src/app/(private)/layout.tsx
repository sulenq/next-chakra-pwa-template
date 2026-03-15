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
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Clock } from "@/components/widgets/clock";
import { HScroll } from "@/components/widgets/h-scroll";
import { BottomIndicator, LeftIndicator } from "@/components/widgets/indicator";
import { Logo } from "@/components/widgets/logo";
import {
  DesktopNavs,
  DesktopNavTooltip,
  MobileNavLink,
} from "@/components/widgets/navs";
import { NavBreadcrumb } from "@/components/widgets/page-shell";
import { ProfileMenuTrigger } from "@/components/widgets/profile-menu";
import { Today } from "@/components/widgets/today";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS, PRIVATE_NAV_GROUPS } from "@/constants/navs";
import {
  DESKTOP_ACTIVE_NAV_BTN_VARIANT,
  BASE_ICON_BOX_SIZE,
  DESKTOP_NAVS_COLOR,
  DESKTOP_NAVS_POPOVER_MAIN_AXIS,
  DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  MOBILE_NAVS_COLOR,
  MOBILE_POPOVER_MAIN_AXIS,
  DESKTOP_NAV_BTN_VARIANT,
  R_SPACING_MD,
  TOP_BAR_H,
  DESKTOP_NAV_BTN_SIZE,
  DESKTOP_NAV_BTN_PX,
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
import { Center, HStack, VStack } from "@chakra-ui/react";
import {
  ChevronsUpDownIcon,
  ServerIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  UserIcon,
} from "lucide-react";
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
      <HScroll borderTop={"1px solid"} borderColor={"border.subtle"}>
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

          <ProfileMenuTrigger flex={1}>
            <VStack
              flex={1}
              color={MOBILE_NAVS_COLOR}
              cursor={"pointer"}
              gap={1}
            >
              {!user?.avatar?.filePath && (
                <AppIconLucide icon={UserIcon} boxSize={5} />
              )}

              {user?.avatar?.filePath && (
                <Avatar
                  src={imgUrl(user?.avatar?.filePath)}
                  name={user?.name}
                  size={"2xs"}
                />
              )}

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

  // States
  const user = getUserData();

  // SX
  // const rSpacing = useBreakpointValue(R_SPACING_MD);

  return (
    <CContainer>
      <HStack
        align={"stretch"}
        h={"100dvh"}
        gap={0}
        overflow={"clip"}
        pos={"relative"}
        zIndex={2}
        {...restProps}
      >
        {/* Sidebar */}
        <CContainer
          flexShrink={0}
          w={isNavsExpanded ? "250px" : "60px"}
          pb={R_SPACING_MD}
          overflowY={"auto"}
          overflowX={"clip"}
          transition={"300ms ease"}
        >
          <CContainer flex={1}>
            {/* Header */}
            <CContainer
              justify={"center"}
              gap={isNavsExpanded ? 1 : 5}
              h={isNavsExpanded ? TOP_BAR_H : "fit"}
              p={R_SPACING_MD}
            >
              {/* Logo Only */}
              {!isNavsExpanded && (
                <NavLink to="/">
                  <Center w={"36px"} h={"28px"} ml={"1px"}>
                    <Logo size={18} />
                  </Center>
                </NavLink>
              )}

              <HStack justify={"space-between"}>
                {/* Logo & App Name */}
                {isNavsExpanded && (
                  <NavLink to="/">
                    <HStack ml={"6px"} gap={3}>
                      <Logo size={18} />

                      <P
                        w={"full"}
                        fontSize={16}
                        fontWeight={"semibold"}
                        lineClamp={1}
                      >
                        {APP.name}
                      </P>
                    </HStack>
                  </NavLink>
                )}

                {/* Toggle Side Navs */}
                <Tooltip
                  content={isNavsExpanded ? t.minimize : t.maximize}
                  positioning={{
                    placement: "right",
                    offset: {
                      mainAxis: DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
                    },
                  }}
                >
                  <Btn
                    order={isNavsExpanded ? 2 : 1}
                    iconButton
                    clicky={false}
                    variant={"ghost"}
                    w={"36px"}
                    color={DESKTOP_NAVS_COLOR}
                    onClick={toggleNavsExpanded}
                  >
                    <AppIconLucide
                      icon={isNavsExpanded ? SidebarCloseIcon : SidebarOpenIcon}
                      boxSize={BASE_ICON_BOX_SIZE}
                    />
                  </Btn>
                </Tooltip>
              </HStack>
            </CContainer>

            {/* Navs */}
            <CContainer flex={1}>
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
                          {pathname.includes("/master-data") && (
                            <LeftIndicator />
                          )}

                          <AppIconLucide
                            icon={ServerIcon}
                            color={
                              pathname.includes("/master-data")
                                ? ""
                                : DESKTOP_NAVS_COLOR
                            }
                          />

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
                mb={1}
              />
            </CContainer>
          </CContainer>

          {/* Footer */}
          <CContainer px={R_SPACING_MD}>
            <ProfileMenuTrigger
              w={"full"}
              popoverRootProps={{
                positioning: {
                  placement: "right-end",
                  offset: {
                    mainAxis: DESKTOP_NAVS_POPOVER_MAIN_AXIS,
                  },
                },
              }}
            >
              <HStack
                gap={4}
                w={"full"}
                p={isNavsExpanded ? 3 : "2px"}
                bg={"bg.frosted"}
                rounded={themeConfig.radii.component}
                cursor={"pointer"}
                transition={"300ms"}
                pos={"relative"}
                _hover={{
                  bg: "bg.muted",
                }}
              >
                <Avatar
                  src={imgUrl(user?.avatar?.filePath)}
                  name={user?.name}
                  size={isNavsExpanded ? "lg" : "xs"}
                  transition={"300ms"}
                />

                {isNavsExpanded && (
                  <>
                    <CContainer>
                      <P lineClamp={1} fontWeight={"semibold"}>
                        {user?.name || user?.email || "Signed out"}
                      </P>
                      <P lineClamp={1} color={"fg.subtle"}>
                        {user?.name ? user?.email || user?.username : "-"}
                      </P>
                    </CContainer>

                    <AppIconLucide
                      icon={ChevronsUpDownIcon}
                      boxSize={BASE_ICON_BOX_SIZE}
                      color={"fg.subtle"}
                      mr={1}
                    />
                  </>
                )}
              </HStack>
            </ProfileMenuTrigger>
          </CContainer>
        </CContainer>

        {/* Content */}
        <CContainer overflowY={"auto"}>
          <CContainer
            flex={1}
            // borderLeft={"1px solid"}
            borderColor={"border.muted"}
            overflow={"auto"}
          >
            {children}
          </CContainer>
        </CContainer>
      </HStack>
    </CContainer>
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
