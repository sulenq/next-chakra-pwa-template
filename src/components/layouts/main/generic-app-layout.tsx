"use client";

import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Clock } from "@/components/widgets/clock";
import { BottomIndicator, LeftIndicator } from "@/components/widgets/indicator";
import { Logo } from "@/components/widgets/logo";
import { MContainerV } from "@/components/widgets/m-container";
import {
  ConstrainedContainer,
  MainView,
  NavBreadcrumb,
  TopBar,
} from "@/components/widgets/main-view";
import {
  NavsV,
  DesktopNavTooltip,
  MobileNavLink,
  UserPanel,
} from "@/components/widgets/navs";
import { ProfileMenuTrigger } from "@/components/widgets/profile-menu";
import { ScrollH } from "@/components/widgets/scroll-h";
import { Today } from "@/components/widgets/today";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS, PRIVATE_NAV_GROUPS } from "@/constants/navs";
import {
  BOUNCY_TRANSITION,
  DESKTOP_ACTIVE_NAV_BTN_VARIANT,
  DESKTOP_NAV_BTN_ICON_BG,
  DESKTOP_NAV_BTN_PX,
  DESKTOP_NAV_BTN_SIZE,
  DESKTOP_NAV_BTN_VARIANT,
  COMMON_NAV_COLOR,
  DESKTOP_SPACING_MD,
  GAP,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  COMMON_NAV_COLOR,
  MOBILE_POPOVER_MAIN_AXIS,
  R_SPACING_MD,
  TOP_BAR_H,
  USER_PANEL_H,
} from "@/constants/styles";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useNavs } from "@/contexts/use-navs-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { AuthGuard } from "@/features/auth/components/auth-guard";
import { useIsSmScreenWidth } from "@/hooks/use-is-sm-screen-width";
import { useScreen } from "@/hooks/use-screen";
import { last } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { getActiveNavs } from "@/utils/route";
import { pluckString } from "@/utils/string";
import { imgUrl } from "@/utils/url";
import { Box, Center } from "@chakra-ui/react";
import { ChevronsLeftIcon, ChevronsRightIcon, ServerIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

// -----------------------------------------------------------------

const MobileLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();

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
      <MainView.Root
        flex={1}
        bg={MOBILE_CONTENT_CONTAINER_BG}
        overflowY={"auto"}
      >
        {/* Content header */}
        <StackV gap={2}>
          <StackH
            align={"center"}
            justify={"space-between"}
            w={"full"}
            pt={2}
            px={4}
          >
            <StackH align={"center"}>
              <Logo size={15} ml={"-4px"} />
            </StackH>

            <StackH align={"center"} gap={2}>
              <Clock fontSize={"sm"} />

              <Today fontSize={"sm"} />
            </StackH>
          </StackH>

          <StackH
            align={"center"}
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
          </StackH>
        </StackV>

        {children}
      </MainView.Root>

      {/* Navs */}
      <ScrollH
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
                src={imgUrl(user?.avatar?.[0]?.filePath)}
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
      </ScrollH>
    </StackV>
  );
};

// -----------------------------------------------------------------

const DesktopLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();
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
          transition={BOUNCY_TRANSITION}
          pos={"relative"}
        >
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
                    color={`${themeContext.colorPalette}.fg`}
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
                  color={"fg.muted"}
                  zIndex={99}
                  onClick={toggleNavsExpanded}
                >
                  <Center
                    p={2}
                    bg={DESKTOP_NAV_BTN_ICON_BG}
                    rounded={themeContext.radii.component}
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
                <NavsV
                  navs={PRIVATE_NAV_GROUPS}
                  navsExpanded={isNavsExpanded}
                  addonBottomElement={
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
                                ? themeContext.colorPalette
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
                              rounded={themeContext.radii.component}
                            >
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
          <StackV>
            <ConstrainedContainer px={GAP}>
              <Box w={"full"} h={TOP_BAR_H} p={R_SPACING_MD}>
                <TopBar />
              </Box>
            </ConstrainedContainer>
          </StackV>

          <MContainerV flex={1} overflow={"auto"}>
            {children}
          </MContainerV>
        </MainView.Root>
      </StackH>
    </StackV>
  );
};

// -----------------------------------------------------------------

export default function GenericAppLayout(props: any) {
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
