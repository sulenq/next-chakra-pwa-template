"use client";

import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Clock } from "@/components/widgets/clock";
import { ScrollH } from "@/components/widgets/scroll-h";
import { BottomIndicator, LeftIndicator } from "@/components/widgets/indicator";
import { Logo } from "@/components/widgets/logo";
import { MContainerV } from "@/components/widgets/m-container";
import {
  DesktopNavs,
  DesktopNavTooltip,
  MobileNavLink,
  UserPanel,
} from "@/components/widgets/navs";
import { ProfileMenuTrigger } from "@/components/widgets/profile-menu";
import { Today } from "@/components/widgets/today";
import { NavBreadcrumb, TopBar, View } from "@/components/widgets/view";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS, PRIVATE_NAV_GROUPS } from "@/constants/navs";
import {
  DESKTOP_ACTIVE_NAV_BTN_VARIANT,
  DESKTOP_NAV_BTN_ICON_BG,
  DESKTOP_NAV_BTN_PX,
  DESKTOP_NAV_BTN_SIZE,
  DESKTOP_NAV_BTN_VARIANT,
  DESKTOP_NAVS_COLOR,
  DESKTOP_SPACING_MD,
  GAP,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  MOBILE_NAVS_COLOR,
  MOBILE_POPOVER_MAIN_AXIS,
  R_SPACING_MD,
  TOP_BAR_H,
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
import { Center, HStack, VStack } from "@chakra-ui/react";
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
    <StackV flex={1} overflowY={"auto"} {...restProps}>
      {/* Content */}
      <View.Root flex={1} bg={MOBILE_CONTENT_CONTAINER_BG} overflowY={"auto"}>
        {/* Content header */}
        <StackV gap={2}>
          <HStack w={"full"} justify={"space-between"} pt={2} px={4}>
            <HStack>
              <Logo size={15} ml={"-4px"} />
            </HStack>

            <HStack>
              <Clock fontSize={"sm"} />

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
        </StackV>

        {children}
      </View.Root>

      {/* Navs */}
      <ScrollH
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
                              {nav.children.map((subGroup, idx) => {
                                return (
                                  <Menu.ItemGroup
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
      </ScrollH>
    </StackV>
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
              ? `calc(250px + (${DESKTOP_SPACING_MD} * 2) + ${GAP})`
              : `calc(36px + (${DESKTOP_SPACING_MD} * 2) + ${GAP})`
          }
          transition={"200ms"}
          pos={"relative"}
        >
          {/* Content */}
          <StackV
            flex={1}
            gap={GAP}
            pl={GAP}
            pb={GAP}
            overflowY={"auto"}
            overflowX={"clip"}
          >
            {/* Header */}
            <NavLink to={"/"}>
              <StackH
                align={"center"}
                gap={3}
                minH={TOP_BAR_H}
                p={R_SPACING_MD}
              >
                <Logo size={18} ml={"6px"} />

                {isNavsExpanded && (
                  <P
                    lineClamp={1}
                    fontSize={"lg"}
                    fontWeight={"semibold"}
                    color={`${themeConfig.colorPalette}.solid`}
                  >
                    {APP.name}
                  </P>
                )}
              </StackH>
            </NavLink>

            {/* Toggle expand */}
            <DesktopNavTooltip
              content={isNavsExpanded ? t.minimize : t.maximize}
            >
              <StackH px={R_SPACING_MD} my={`calc(${GAP})`}>
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
                  transition={"200ms"}
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
                className={"scrollY"}
                flex={1}
                px={R_SPACING_MD}
                pt={R_SPACING_MD}
                pb={
                  isNavsExpanded
                    ? `calc(${USER_PANEL_H} + (${DESKTOP_SPACING_MD} * 1))`
                    : `calc(36px + (${DESKTOP_SPACING_MD} * 2))`
                }
                mb={GAP}
                transition={"200ms"}
              >
                <DesktopNavs
                  navs={PRIVATE_NAV_GROUPS}
                  navsExpanded={isNavsExpanded}
                  addonElement={
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
                              rounded={themeConfig.radii.component}
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
                    </StackV>
                  }
                  flex={1}
                />
              </StackV>

              {/* User panel */}
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
        <View.Root w={"full"} overflowY={"auto"}>
          <StackV px={GAP}>
            <StackH
              align={"center"}
              w={"full"}
              h={TOP_BAR_H}
              p={R_SPACING_MD}
              // borderBottom={"1px solid"}
              borderColor={"border.muted"}
              // rounded={themeConfig.radii.container}
            >
              <TopBar />
            </StackH>
          </StackV>

          <MContainerV flex={1} overflow={"auto"}>
            {children}
          </MContainerV>
        </View.Root>
      </StackH>
    </StackV>
  );
};

export default function Layout(props: any) {
  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <AuthGuard>
      <StackV id={"app-layout"} h={"100dvh"}>
        {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      </StackV>
    </AuthGuard>
  );
}
