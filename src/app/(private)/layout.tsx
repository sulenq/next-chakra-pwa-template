"use client";

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
} from "@/components/ui/accordion";
import { Avatar } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Divider } from "@/components/ui/divider";
import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widgets/app-icon";
import { AuthGuard } from "@/features/auth/AuthGuard";
import { ClampText } from "@/components/widgets/clamp-text";
import { Clock } from "@/components/widgets/clock";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { HScroll } from "@/components/widgets/h-scroll";
import { BottomIndicator, LeftIndicator } from "@/components/widgets/indicator";
import { Logo } from "@/components/widgets/logo";
import { MContainer } from "@/components/widgets/m-container";
import { DesktopNavTooltip, MobileNavLink } from "@/components/widgets/navs";
import { NavBreadcrumb, TopBar } from "@/components/widgets/page-shell";
import { ProfileMenuTrigger } from "@/components/widgets/profile-menu";
import { Today } from "@/components/widgets/today";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAV_GROUPS, PRIVATE_NAV_GROUPS } from "@/constants/navs";
import {
  BASE_ICON_BOX_SIZE,
  DESKTOP_CONTENT_CONTAINER_BG,
  DESKTOP_NAVS_BG,
  DESKTOP_NAVS_COLOR,
  DESKTOP_NAVS_POPOVER_MAIN_AXIS,
  DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
  MOBILE_CONTENT_CONTAINER_BG,
  MOBILE_NAV_LABEL_FONT_SIZE,
  MOBILE_NAVS_COLOR,
  MOBILE_POPOVER_MAIN_AXIS,
  NAVS_COLOR_PALETTE,
  TOP_BAR_H,
} from "@/constants/styles";
import useLocale from "@/contexts/useLocale";
import useNavs from "@/contexts/useNavs";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useScreen from "@/hooks/useScreen";
import { isEmptyArray, last } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { Box, Center, HStack, Icon, VStack } from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";
import {
  ChevronsUpDownIcon,
  ServerIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

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
                          <AppIcon icon={nav.icon} />

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
                                <AppIcon icon={nav.icon} />

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
                <AppIcon icon={nav.icon} />

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
                <AppIcon icon={UserIcon} boxSize={5} />
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

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const pathname = usePathname();

  // States
  const user = getUserData();
  const [search, setSearch] = useState<string>("");
  const roleId = user?.role?.id;
  const q = (search ?? "").toLowerCase();
  const isAllowed = (item: { allowedRoles?: string[] }, roleId?: string) =>
    !item.allowedRoles ||
    item.allowedRoles.length === 0 ||
    (roleId && item.allowedRoles.includes(roleId));

  const qNormalized = q?.toLowerCase().trim();

  const resolvedNavs = PRIVATE_NAV_GROUPS.map((nav) => {
    const filteredList = nav.navs
      .map((nav) => {
        const labelMain =
          nav.label?.toLowerCase() ??
          pluckString(t, nav.labelKey)?.toLowerCase() ??
          "";
        const allowedMain = isAllowed(nav, roleId);

        if (!nav.children || nav.children.length === 0) {
          if (!qNormalized) return allowedMain ? nav : null;
          const isMatchMain = qNormalized && labelMain.includes(qNormalized);
          return allowedMain && isMatchMain ? nav : null;
        }

        const subsFilteredByRole = nav.children
          .map((sub) => ({
            ...sub,
            navs: (sub.navs ?? []).filter((subItem) =>
              isAllowed(subItem, roleId),
            ),
          }))
          .filter((s) => (s.navs ?? []).length > 0);

        if (!qNormalized) {
          if (allowedMain)
            return subsFilteredByRole.length > 0
              ? { ...nav, children: subsFilteredByRole }
              : { ...nav, children: undefined };
          return subsFilteredByRole.length > 0
            ? { ...nav, children: subsFilteredByRole }
            : null;
        }

        const isMatchMain = qNormalized && labelMain.includes(qNormalized);

        if (isMatchMain && allowedMain) {
          return subsFilteredByRole.length > 0
            ? { ...nav, children: subsFilteredByRole }
            : { ...nav, children: undefined };
        }

        const matchedSubs = nav.children
          .map((sub) => ({
            ...sub,
            navs: (sub.navs ?? []).filter((subItem) => {
              if (!isAllowed(subItem, roleId)) return false;
              const subLabel =
                subItem.label?.toLowerCase() ||
                pluckString(t, subItem.labelKey)?.toLowerCase() ||
                "";
              return qNormalized && subLabel.includes(qNormalized);
            }),
          }))
          .filter((s) => (s.navs ?? []).length > 0);

        return matchedSubs.length > 0
          ? { ...nav, children: matchedSubs }
          : null;
      })
      .filter(Boolean) as typeof nav.navs;

    return filteredList.length > 0 ? { ...nav, navs: filteredList } : null;
  }).filter(Boolean) as typeof PRIVATE_NAV_GROUPS;

  useEffect(() => {
    if (!isNavsExpanded) {
      setSearch("");
    } else {
      searchInputRef.current?.focus();
    }
  }, [isNavsExpanded]);

  return (
    <HStack
      align={"stretch"}
      gap={0}
      h={"100dvh"}
      overflowY={"auto"}
      {...restProps}
    >
      {/* Sidebar */}
      <CContainer
        flexShrink={0}
        w={isNavsExpanded ? "250px" : "60px"}
        bg={isNavsExpanded ? "bgContent" : DESKTOP_NAVS_BG}
        // borderRight={isNavsExpanded ? "" : "1px solid"}
        borderColor={"border.muted"}
        transition={"200ms"}
      >
        {/* Logo & Sidebar Toggle */}
        <CContainer
          justify={"center"}
          gap={isNavsExpanded ? 1 : 3}
          h={isNavsExpanded ? TOP_BAR_H : "fit"}
          p={3}
        >
          {/* Logo Only */}
          {!isNavsExpanded && (
            <NavLink to="/">
              <Center w={"36px"} h={"28px"} ml={"-0.5px"}>
                <Logo size={15} />
              </Center>
            </NavLink>
          )}

          <HStack justify={"space-between"}>
            {/* Logo & App Name */}
            {isNavsExpanded && (
              <NavLink to="/">
                <HStack ml={"6px"} gap={3}>
                  <Logo size={15} />

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
                colorPalette={NAVS_COLOR_PALETTE}
                w={"36px"}
                color={DESKTOP_NAVS_COLOR}
                mt={2}
                onClick={toggleNavsExpanded}
              >
                <AppIcon
                  icon={isNavsExpanded ? SidebarCloseIcon : SidebarOpenIcon}
                  boxSize={BASE_ICON_BOX_SIZE}
                />
              </Btn>
            </Tooltip>
          </HStack>
        </CContainer>

        {/* Search */}
        {isNavsExpanded && (
          <CContainer px={3} py={2}>
            <SearchInput
              inputRef={searchInputRef}
              queryKey={"q-sidebar-navs"}
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
            />
          </CContainer>
        )}

        {/* Navs List */}
        <MContainer
          className="scrollY"
          overflowX={"clip"}
          flex={1}
          gap={1}
          px={3}
          py={2}
          // pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
        >
          {/* Private Navs */}
          <CContainer gap={1}>
            {isEmptyArray(resolvedNavs) && <FeedbackNotFound />}

            {!isEmptyArray(resolvedNavs) &&
              resolvedNavs.map((navItem, navItemIdx) => {
                return (
                  <CContainer key={navItemIdx} gap={1}>
                    {isNavsExpanded && navItem.labelKey && (
                      <ClampText
                        fontSize={"sm"}
                        fontWeight={"semibold"}
                        letterSpacing={"wide"}
                        color={"fg.subtle"}
                        ml={1}
                      >
                        {pluckString(t, navItem.labelKey)}
                      </ClampText>
                    )}

                    {navItem.navs.map((nav) => {
                      const hasSubMenus = nav.children;
                      const isMainNavsActive = pathname.includes(nav.path);

                      return (
                        <Fragment key={nav.path}>
                          {!hasSubMenus && (
                            <NavLink key={nav.path} to={nav.path} w={"full"}>
                              <DesktopNavTooltip
                                content={pluckString(t, nav.labelKey)}
                              >
                                <Btn
                                  iconButton={isNavsExpanded ? false : true}
                                  clicky={false}
                                  gap={4}
                                  px={2}
                                  justifyContent={"start"}
                                  variant={"ghost"}
                                  color={
                                    isMainNavsActive ? "" : DESKTOP_NAVS_COLOR
                                  }
                                >
                                  {isMainNavsActive && nav.icon && (
                                    <LeftIndicator />
                                  )}

                                  {nav.icon && <AppIcon icon={nav.icon} />}

                                  {!nav.icon && (
                                    <Icon
                                      boxSize={2}
                                      color={
                                        isMainNavsActive
                                          ? themeConfig.primaryColor
                                          : "d2"
                                      }
                                    >
                                      <IconCircleFilled />
                                    </Icon>
                                  )}

                                  {isNavsExpanded && (
                                    <P lineClamp={1} textAlign={"left"}>
                                      {pluckString(t, nav.labelKey)}
                                    </P>
                                  )}
                                </Btn>
                              </DesktopNavTooltip>
                            </NavLink>
                          )}

                          {hasSubMenus && (
                            <>
                              {!isNavsExpanded && (
                                <MenuRoot
                                  positioning={{
                                    placement: "right-start",
                                    offset: {
                                      mainAxis: DESKTOP_NAVS_POPOVER_MAIN_AXIS,
                                    },
                                  }}
                                >
                                  <DesktopNavTooltip
                                    content={
                                      nav.label
                                        ? nav.label
                                        : pluckString(t, nav.labelKey)
                                    }
                                  >
                                    <CContainer>
                                      <MenuTrigger asChild>
                                        <Btn
                                          iconButton
                                          clicky={false}
                                          px={2}
                                          justifyContent="start"
                                          variant="ghost"
                                          colorPalette={NAVS_COLOR_PALETTE}
                                          pos="relative"
                                          color={
                                            isMainNavsActive
                                              ? ""
                                              : DESKTOP_NAVS_COLOR
                                          }
                                        >
                                          {isMainNavsActive && (
                                            <LeftIndicator />
                                          )}
                                          <AppIcon icon={nav.icon} />
                                        </Btn>
                                      </MenuTrigger>
                                    </CContainer>
                                  </DesktopNavTooltip>

                                  <MenuContent>
                                    {nav.children?.map(
                                      (subGroup, menuItemIdx) => (
                                        <MenuItemGroup
                                          key={menuItemIdx}
                                          gap={1}
                                          title={
                                            subGroup.labelKey
                                              ? pluckString(
                                                  t,
                                                  subGroup.labelKey,
                                                )
                                              : ""
                                          }
                                        >
                                          {subGroup.navs.map((menu) => {
                                            const isSubNavsActive =
                                              pathname === menu.path;

                                            return (
                                              <NavLink
                                                key={menu.path}
                                                to={menu.path}
                                                w="full"
                                              >
                                                <Tooltip
                                                  content={
                                                    menu.label
                                                      ? menu.label
                                                      : pluckString(
                                                          t,
                                                          menu.labelKey,
                                                        )
                                                  }
                                                  positioning={{
                                                    placement: "right",
                                                    offset: { mainAxis: 12 },
                                                  }}
                                                >
                                                  <MenuItem
                                                    value={menu.path}
                                                    px={3}
                                                    color={
                                                      isSubNavsActive
                                                        ? ""
                                                        : DESKTOP_NAVS_COLOR
                                                    }
                                                  >
                                                    {isSubNavsActive && (
                                                      <LeftIndicator />
                                                    )}
                                                    <P lineClamp={1}>
                                                      {menu.label
                                                        ? menu.label
                                                        : pluckString(
                                                            t,
                                                            menu.labelKey,
                                                          )}
                                                    </P>
                                                  </MenuItem>
                                                </Tooltip>
                                              </NavLink>
                                            );
                                          })}
                                        </MenuItemGroup>
                                      ),
                                    )}
                                  </MenuContent>
                                </MenuRoot>
                              )}

                              {isNavsExpanded && (
                                <AccordionRoot
                                  multiple
                                  value={search ? [nav.path] : undefined}
                                >
                                  <AccordionItem
                                    value={nav.path}
                                    border="none"
                                    rounded={themeConfig.radii.component}
                                    _open={{ bg: "transparent" }}
                                  >
                                    <DesktopNavTooltip
                                      content={pluckString(t, nav.labelKey)}
                                    >
                                      <Btn
                                        as={AccordionItemTrigger}
                                        clicky={false}
                                        variant="ghost"
                                        px={2}
                                        justifyContent="start"
                                        pr="10px"
                                        pos="relative"
                                        bg="transparent"
                                        color={
                                          isMainNavsActive
                                            ? ""
                                            : DESKTOP_NAVS_COLOR
                                        }
                                        _hover={{ bg: "bg.muted" }}
                                      >
                                        {isMainNavsActive && <LeftIndicator />}
                                        <HStack gap={4}>
                                          <AppIcon icon={nav.icon} />

                                          <P lineClamp={1} textAlign="left">
                                            {nav.label
                                              ? nav.label
                                              : pluckString(t, nav.labelKey)}
                                          </P>
                                        </HStack>
                                      </Btn>
                                    </DesktopNavTooltip>

                                    <AccordionItemContent p={0}>
                                      <CContainer gap={1} pt={1}>
                                        {nav.children?.map(
                                          (subGroup, menuItemIdx) => (
                                            <CContainer
                                              key={menuItemIdx}
                                              gap={1}
                                            >
                                              {subGroup.labelKey && (
                                                <ClampText
                                                  fontSize="sm"
                                                  fontWeight="semibold"
                                                  color="fg.subtle"
                                                  ml={9}
                                                  mt={1}
                                                >
                                                  {pluckString(
                                                    t,
                                                    subGroup.labelKey,
                                                  )}
                                                </ClampText>
                                              )}

                                              {subGroup.navs.map(
                                                (menu, idx) => {
                                                  const isFirstIdx = idx === 0;
                                                  const isLastIdx =
                                                    idx ===
                                                    subGroup.navs.length - 1;
                                                  const isSubNavsActive =
                                                    pathname === menu.path;

                                                  return (
                                                    <NavLink
                                                      key={menu.path}
                                                      to={menu.path}
                                                      w="full"
                                                    >
                                                      <Tooltip
                                                        content={
                                                          menu.label
                                                            ? menu.label
                                                            : menu.labelKey
                                                              ? pluckString(
                                                                  t,
                                                                  menu.labelKey,
                                                                )
                                                              : "-"
                                                        }
                                                        positioning={{
                                                          placement: "right",
                                                          offset: {
                                                            mainAxis:
                                                              DESKTOP_NAVS_TOOLTIP_MAIN_AXIS +
                                                              2,
                                                          },
                                                        }}
                                                      >
                                                        <HStack
                                                          pos="relative"
                                                          pl="8.5px"
                                                          gap={1}
                                                        >
                                                          {!isFirstIdx && (
                                                            <Box
                                                              w="1px"
                                                              h="calc(50% + 2px)"
                                                              pos="absolute"
                                                              top="-2px"
                                                              left="18px"
                                                              bg="d3"
                                                            />
                                                          )}
                                                          {!isLastIdx && (
                                                            <Box
                                                              w="1px"
                                                              h="calc(50% + 2px)"
                                                              pos="absolute"
                                                              bottom="-2px"
                                                              left="18px"
                                                              bg="d3"
                                                            />
                                                          )}

                                                          <Center
                                                            boxSize={
                                                              BASE_ICON_BOX_SIZE
                                                            }
                                                            zIndex={2}
                                                            ml="1.5px"
                                                          >
                                                            <Icon
                                                              boxSize={2}
                                                              color={
                                                                isSubNavsActive
                                                                  ? themeConfig.primaryColor
                                                                  : "bg.emphasized"
                                                              }
                                                            >
                                                              <IconCircleFilled
                                                                stroke={1.5}
                                                              />
                                                            </Icon>
                                                          </Center>

                                                          <Btn
                                                            clicky={false}
                                                            flex={1}
                                                            gap={3}
                                                            px={3}
                                                            rounded={`calc(${themeConfig.radii.component})`}
                                                            justifyContent="start"
                                                            variant="ghost"
                                                            colorPalette={
                                                              NAVS_COLOR_PALETTE
                                                            }
                                                            color={
                                                              isSubNavsActive
                                                                ? ""
                                                                : DESKTOP_NAVS_COLOR
                                                            }
                                                          >
                                                            <P
                                                              lineClamp={1}
                                                              textAlign="left"
                                                            >
                                                              {menu.label
                                                                ? menu.label
                                                                : menu.labelKey
                                                                  ? pluckString(
                                                                      t,
                                                                      menu.labelKey,
                                                                    )
                                                                  : "-"}
                                                            </P>
                                                          </Btn>
                                                        </HStack>
                                                      </Tooltip>
                                                    </NavLink>
                                                  );
                                                },
                                              )}
                                            </CContainer>
                                          ),
                                        )}
                                      </CContainer>
                                    </AccordionItemContent>
                                  </AccordionItem>
                                </AccordionRoot>
                              )}
                            </>
                          )}
                        </Fragment>
                      );
                    })}
                  </CContainer>
                );
              })}
          </CContainer>

          <CContainer gap={1} mt={"auto"}>
            {/* {OTHER_PRIVATE_NAV_GROUPS[0].navs.map((nav) => {
              return (
                <NavLink key={nav.path} to={nav.path} w={"full"}>
                  <DesktopNavTooltip content={pluckString(t, nav.labelKey)}>
                    <Btn
                      clicky={false}
                      gap={4}
                      justifyContent={"start"}
                      variant={"ghost"}
                      colorPalette={NAVS_COLOR_PALETTE}
                      px={2}
                      pos={"relative"}
                      color={pathname.includes(nav.path) ? "" : DESKTOP_NAVS_COLOR}
                    >
                      {pathname.includes(nav.path) && <LeftIndicator />}

                      <AppIcon icon={nav.icon} />

                      {isNavsExpanded && (
                        <P lineClamp={1} textAlign={"left"}>
                          {pluckString(t, nav.labelKey)}
                        </P>
                      )}
                    </Btn>
                  </DesktopNavTooltip>
                </NavLink>
              );
            })} */}

            <NavLink key={"/master-data"} to={"/master-data"} w={"full"}>
              <DesktopNavTooltip content={pluckString(t, "navs.master_data")}>
                <Btn
                  clicky={false}
                  gap={4}
                  justifyContent={"start"}
                  variant={"ghost"}
                  colorPalette={NAVS_COLOR_PALETTE}
                  px={2}
                  pos={"relative"}
                  color={
                    pathname.includes("/master-data") ? "" : DESKTOP_NAVS_COLOR
                  }
                >
                  {pathname.includes("/master-data") && <LeftIndicator />}

                  <AppIcon icon={ServerIcon} />

                  {isNavsExpanded && (
                    <P lineClamp={1} textAlign={"left"}>
                      {pluckString(t, "navs.master_data")}
                    </P>
                  )}
                </Btn>
              </DesktopNavTooltip>
            </NavLink>
          </CContainer>
        </MContainer>

        {isNavsExpanded && (
          <CContainer px={3}>
            <Divider />
          </CContainer>
        )}

        <CContainer p={3}>
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
              w={isNavsExpanded ? "full" : "36px"}
              h={isNavsExpanded ? "" : "36px"}
              px={"6px"}
              py={2}
              rounded={themeConfig.radii.component}
              cursor={"pointer"}
              _hover={{
                bg: "gray.subtle",
              }}
              justify={isNavsExpanded ? "" : "center"}
              transition={"200ms"}
              pos={"relative"}
            >
              <Avatar
                src={imgUrl(user?.avatar?.filePath)}
                name={user?.name}
                size={isNavsExpanded ? "md" : "2xs"}
                mr={"auto"}
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

                  <AppIcon
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
      <CContainer bg={DESKTOP_CONTENT_CONTAINER_BG} overflowY={"auto"}>
        <CContainer
          flex={1}
          bg={"body"}
          color={"ibody"}
          // borderLeft={"1px solid"}
          borderColor={"border.muted"}
          overflow={"auto"}
        >
          <TopBar />

          {children}
        </CContainer>
      </CContainer>
    </HStack>
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
