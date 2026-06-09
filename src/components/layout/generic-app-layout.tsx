"use client";

import { AppIconLucide } from "@/components/branding/app-icon";
import { Logo } from "@/components/branding/logo";
import { HScroll } from "@/components/container/h-scroll";
import { MVContainer } from "@/components/container/m-container";
import {
  ConstrainedContainer,
  MainView,
  NavBreadcrumb,
  TopBar,
} from "@/components/container/main-view";
import {
  DesktopNavTooltip,
  MobileNavLink,
  VNavs,
} from "@/components/navigation/nav";
import { UserPanel } from "@/components/navigation/user-panel";
import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { BottomIndicator, LeftIndicator } from "@/components/ui/indicator";
import { Menu } from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { ProfileMenuTrigger } from "@/components/user/profile-menu";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS, PRIVATE_NAV_GROUPS } from "@/constants/navs";
import {
  BOUNCY_TRANSITION,
  COMMON_NAV_COLOR,
  DESKTOP_ACTIVE_NAV_BTN_VARIANT,
  DESKTOP_NAV_BTN_PX,
  DESKTOP_NAV_BTN_SIZE,
  DESKTOP_NAV_BTN_VARIANT,
  GAP,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  MOBILE_POPOVER_MAIN_AXIS,
  SPACING_MD,
  TOP_BAR_H,
  USER_PANEL_H,
} from "@/constants/styles";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { useIsSmScreenWidth } from "@/hooks/use-is-sm-screen-width";
import { useScreen } from "@/hooks/use-screen";
import { useAuthStore } from "@/stores/use-auth-store";
import { useNavsStore } from "@/stores/use-navs-store";
import { last } from "@/utils/array";
import { getActiveNavs } from "@/utils/route";
import { pluckString } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { Box, Center, Circle } from "@chakra-ui/react";
import { ChevronsLeftIcon, ChevronsRightIcon, ServerIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

// -----------------------------------------------------------------

const MobileLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();

  // Hooks
  const pathname = usePathname();
  const { sw } = useScreen();

  // States
  const user = useAuthStore((s) => s.auth.user);
  const activeNavs = getActiveNavs(pathname);
  const resolvedActiveNavs =
    sw < 360 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;
  const isInProfileRoute = pathname.includes(`/profile`);

  return (
    <StackV flex={1} overflowY={"auto"} {...restProps}>
      {/* Content */}
      <MainView.Root
        flex={1}
        bg={MOBILE_CONTENT_CONTAINER_BG}
        overflowY={"auto"}
      >
        {/* Content header */}
        <StackH
          align={"center"}
          gap={4}
          px={4}
          py={1}
          bg={"bg.canvas"}
          borderBottom={"1px solid"}
          borderColor={"border.muted"}
          justify={"space-between"}
          pos={"sticky"}
          top={0}
          zIndex={2}
        >
          <NavBreadcrumb
            backPath={backPath}
            resolvedActiveNavs={resolvedActiveNavs}
            ml={backPath ? -2 : -1}
          />
        </StackH>

        {children}
      </MainView.Root>

      {/* Navs */}
      <HScroll
        bg={"bg.body"}
        borderTop={"1px solid"}
        borderColor={"border.subtle"}
      >
        <StackH
          align={"center"}
          w={"max"}
          gap={4}
          px={4}
          pt={3}
          pb={5}
          mx={"auto"}
        >
          {PRIVATE_NAV_GROUPS.map((group, index) => {
            return (
              <Fragment key={index}>
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
                          <Menu.Root
                            positioning={{
                              placement: "top",
                              offset: {
                                mainAxis: MOBILE_POPOVER_MAIN_AXIS,
                              },
                            }}
                          >
                            <Menu.Trigger asChild>
                              <StackV
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
                              </StackV>
                            </Menu.Trigger>

                            <Menu.Content>
                              {nav.children.map((subGroup, index) => {
                                return (
                                  <Menu.ItemGroup
                                    key={index}
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
                                          <Menu.Item
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
                                          </Menu.Item>
                                        </NavLink>
                                      );
                                    })}
                                  </Menu.ItemGroup>
                                );
                              })}
                            </Menu.Content>
                          </Menu.Root>
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
                color={pathname === nav.path ? "" : COMMON_NAV_COLOR}
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
            <StackV
              flex={1}
              align={"center"}
              gap={1}
              color={COMMON_NAV_COLOR}
              cursor={"pointer"}
            >
              <Avatar
                src={imgUrl(user?.avatar?.[0]?.path)}
                name={user?.name}
                size={"2xs"}
              />

              <P
                fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                textAlign={"center"}
                color={isInProfileRoute ? "" : COMMON_NAV_COLOR}
                lineClamp={1}
              >
                {t.profile}
              </P>
            </StackV>
          </ProfileMenuTrigger>
        </StackH>
      </HScroll>
    </StackV>
  );
};

// -----------------------------------------------------------------

const DesktopLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();
  const isNavsExpanded = useNavsStore((s) => s.isNavsExpanded);
  const toggleNavsExpanded = useNavsStore((s) => s.toggleNavsExpanded);

  // Hooks
  const pathname = usePathname();

  return (
    <StackH
      flex={1}
      w={"full"}
      h={"100svh"}
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
            ? `calc(250px + (${SPACING_MD} * 2))`
            : `calc(36px + (${SPACING_MD} * 2))`
        }
        transition={BOUNCY_TRANSITION}
        pos={"relative"}
      >
        <StackV flex={1} overflowY={"auto"} overflowX={"clip"}>
          {/* Header */}
          <NavLink to={"/"} w={"fit"}>
            <StackH align={"center"} gap={3} minH={TOP_BAR_H} p={SPACING_MD}>
              <Logo size={18} ml={"6px"} />

              {isNavsExpanded && (
                <P
                  lineClamp={1}
                  fontSize={"lg"}
                  fontWeight={"semibold"}
                  color={`${theme.colorPalette}.fg`}
                >
                  {APP.name}
                </P>
              )}
            </StackH>
          </NavLink>

          {/* Toggle expand */}
          <DesktopNavTooltip content={isNavsExpanded ? t.minimize : t.maximize}>
            <StackH px={SPACING_MD} my={2}>
              <Btn
                flex={1}
                aria-label={"toggle expand navs"}
                size={DESKTOP_NAV_BTN_SIZE}
                variant={DESKTOP_NAV_BTN_VARIANT}
                justifyContent={"start"}
                px={DESKTOP_NAV_BTN_PX}
                color={"fg.muted"}
                zIndex={99}
                onClick={toggleNavsExpanded}
              >
                <Center
                  p={2}
                  // bg={DESKTOP_NAV_BTN_ICON_BG}
                  rounded={theme.radii.component}
                >
                  <AppIconLucide
                    icon={isNavsExpanded ? ChevronsLeftIcon : ChevronsRightIcon}
                  />
                </Center>

                {isNavsExpanded && (
                  <P>{isNavsExpanded ? t.minimize : t.maximize}</P>
                )}
              </Btn>
            </StackH>
          </DesktopNavTooltip>

          {/* Navs & user panel */}
          <StackV flex={1} overflowY={"auto"} pos={"relative"}>
            {/* Navs */}
            <StackV
              className={"scrollY"}
              flex={1}
              px={SPACING_MD}
              pt={SPACING_MD}
              pb={
                isNavsExpanded
                  ? `calc(${USER_PANEL_H} + (${SPACING_MD} * 1 + ${SPACING_MD}))`
                  : `calc(36px + (${SPACING_MD} * 2))`
              }
              mb={GAP}
              transition={"200ms"}
            >
              <VNavs
                navs={PRIVATE_NAV_GROUPS}
                navsExpanded={isNavsExpanded}
                addonBottomElement={
                  // Master data nav
                  <StackV gap={1} mt={"auto"}>
                    <NavLink
                      key={"/master-data"}
                      to={"/master-data"}
                      w={"full"}
                    >
                      <DesktopNavTooltip
                        content={pluckString(t, "navs.master_data")}
                      >
                        <Btn
                          justifyContent={isNavsExpanded ? "start" : "start"}
                          px={DESKTOP_NAV_BTN_PX}
                          size={DESKTOP_NAV_BTN_SIZE}
                          variant={
                            pathname.includes("/master-data")
                              ? DESKTOP_ACTIVE_NAV_BTN_VARIANT
                              : DESKTOP_NAV_BTN_VARIANT
                          }
                          colorPalette={
                            pathname.includes("/master-data")
                              ? theme.colorPalette
                              : ""
                          }
                          pos={"relative"}
                        >
                          <Center p={2} rounded={theme.radii.component}>
                            <AppIconLucide
                              icon={ServerIcon}
                              color={
                                pathname.includes("/master-data")
                                  ? ""
                                  : COMMON_NAV_COLOR
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
                  </StackV>
                }
                flex={1}
              />
            </StackV>

            {/* User panel */}
            <StackV
              w={"full"}
              p={isNavsExpanded ? SPACING_MD : 0}
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
      <MainView.Root w={"full"} overflowY={"auto"}>
        <ConstrainedContainer>
          <StackH w={"full"} h={TOP_BAR_H} p={SPACING_MD}>
            <TopBar showDateTime={false} />
          </StackH>
        </ConstrainedContainer>

        <MVContainer flex={1} overflowY={"auto"} pos={"relative"}>
          <ConstrainedContainer flex={1} pos={"relative"}>
            {children}
          </ConstrainedContainer>
        </MVContainer>
      </MainView.Root>
    </StackH>
  );
};

// -----------------------------------------------------------------

export default function GenericAppLayout(props: any) {
  // Stores
  const { theme } = useThemeStore();
  const isNavsExpanded = useNavsStore((s) => s.isNavsExpanded);

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <AuthGuard>
      <StackV id={"app-layout"} h={"100dvh"}>
        {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      </StackV>

      <Box
        w={"full"}
        h={"500px"}
        pointerEvents={"none"}
        opacity={theme.ambienceColor ? 0.05 : 0}
        bgGradient={"to-t"}
        gradientFrom={`${theme.colorPalette}.solid`}
        gradientTo={"transparent 90%"}
        transition={"1000ms"}
        pos={"fixed"}
        bottom={0}
        left={0}
      />

      <Circle
        aspectRatio={1}
        w={"full"}
        h={"auto"}
        bg={"bg.canvas"}
        filter={"blur(40px)"}
        opacity={theme.ambienceColor ? 0.75 : 0}
        pos={"absolute"}
        left={0}
        bottom={"50px"}
        transform={`translateX(${isNavsExpanded ? "60px" : "0px"})`}
        transition={"opacity 1000ms, filter 1000ms, transform 200ms"}
      />
    </AuthGuard>
  );
}
