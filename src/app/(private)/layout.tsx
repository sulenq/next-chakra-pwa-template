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
import {
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchInput from "@/components/ui/search-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import Clock from "@/components/widget/Clock";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import HScroll from "@/components/widget/HScroll";
import { BottomIndicator, LeftIndicator } from "@/components/widget/Indicator";
import { Logo } from "@/components/widget/Logo";
import { MiniMyProfile } from "@/components/widget/MiniMyProfile";
import { DesktopNavTooltip, MobileNavLink } from "@/components/widget/Navs";
import { NavBreadcrumb, TopBar } from "@/components/widget/PageShell";
import { Today } from "@/components/widget/Today";
import { VerifyingScreen } from "@/components/widget/VerifyingScreen";
import { APP } from "@/constants/_meta";
import { OTHER_PRIVATE_NAVS, PRIVATE_NAVS } from "@/constants/navs";
import { Props__Layout } from "@/constants/props";
import {
  BASE_ICON_BOX_SIZE,
  FIREFOX_SCROLL_Y_CLASS_PR_PREFIX,
} from "@/constants/styles";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import useNavs from "@/context/useNavs";
import { useThemeConfig } from "@/context/useThemeConfig";
import useClickOutside from "@/hooks/useClickOutside";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import useScreen from "@/hooks/useScreen";
import { isEmptyArray, last } from "@/utils/array";
import {
  getAccessToken,
  getUserData,
  setAccessToken,
  setUserData,
} from "@/utils/auth";
import { pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import {
  Box,
  Center,
  HStack,
  Icon,
  StackProps,
  VStack,
} from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";
import {
  ChevronsUpDownIcon,
  DatabaseIcon,
  SidebarCloseIcon,
  SidebarOpenIcon,
  UserIcon,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import {
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
} from "../../constants/styles";

const USER_PROFILE_URL = "/api/get-user-profile";

const MiniMyProfilePopoverTrigger = (props: StackProps) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  useClickOutside(containerRef, onClose);

  // States
  const [open, setOpen] = useState<boolean>(false);

  // Utils
  function onOpen() {
    setOpen(true);
  }
  function onClose() {
    setOpen(false);
  }

  return (
    <PopoverRoot
      open={open}
      positioning={{
        placement: "right-end",
        offset: {
          mainAxis: DESKTOP_NAVS_POPOVER_MAIN_AXIS,
          crossAxis: 4,
        },
      }}
    >
      <PopoverTrigger asChild>
        <CContainer w={"fit"} onClick={onOpen} {...props} />
      </PopoverTrigger>

      <PopoverContent ref={containerRef} w={"235px"} zIndex={10}>
        <MiniMyProfile onClose={onClose} />
      </PopoverContent>
    </PopoverRoot>
  );
};

const MobileLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { l } = useLang();

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
          {PRIVATE_NAVS.map((navItem, idx) => {
            return (
              <Fragment key={idx}>
                {navItem.list.map((nav, idx) => {
                  const isMainNavActive = pathname.includes(nav.path);

                  return (
                    idx > 0 && (
                      <Fragment key={nav.path}>
                        {!nav.subMenus && (
                          <MobileNavLink
                            key={nav.path}
                            to={nav.subMenus ? "" : nav.path}
                            color={isMainNavActive ? "" : "fg.muted"}
                            flex={1}
                          >
                            <AppIcon icon={nav.icon} />

                            <P
                              textAlign={"center"}
                              lineClamp={1}
                              fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
                            >
                              {pluckString(l, nav.labelKey)}
                            </P>

                            {isMainNavActive && <BottomIndicator />}
                          </MobileNavLink>
                        )}

                        {nav.subMenus && (
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
                                    {pluckString(l, nav.labelKey)}
                                  </P>

                                  {isMainNavActive && <BottomIndicator />}
                                </CContainer>
                              </MenuTrigger>

                              <MenuContent>
                                {nav.subMenus.map((menuItem, idx) => {
                                  return (
                                    <MenuItemGroup
                                      key={idx}
                                      title={
                                        menuItem.groupLabelKey
                                          ? pluckString(
                                              l,
                                              menuItem.groupLabelKey,
                                            )
                                          : ""
                                      }
                                    >
                                      {menuItem.list.map((menu) => {
                                        const isSubNavsActive =
                                          pathname === menu.path;

                                        return (
                                          <NavLink
                                            key={menu.path}
                                            w={"full"}
                                            to={menu.path}
                                          >
                                            <MenuItem
                                              value={menu.path}
                                              h={"44px"}
                                              px={3}
                                            >
                                              {isSubNavsActive && (
                                                <LeftIndicator />
                                              )}

                                              <P lineClamp={1}>
                                                {pluckString(l, menu.labelKey)}
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
                    )
                  );
                })}
              </Fragment>
            );
          })}

          {OTHER_PRIVATE_NAVS[0]?.list.map((nav) => {
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
                  {pluckString(l, nav.labelKey)}
                </P>

                {pathname === nav.path && <BottomIndicator />}
              </MobileNavLink>
            );
          })}

          <MiniMyProfilePopoverTrigger flex={1}>
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
                {l.profile}
              </P>
            </VStack>
          </MiniMyProfilePopoverTrigger>
        </HStack>
      </HScroll>
    </CContainer>
  );
};
const DesktopLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const navsExpanded = useNavs((s) => s.navsExpanded);
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

  const resolvedNavs = PRIVATE_NAVS.map((nav) => {
    const filteredList = nav.list
      .map((item) => {
        const labelMain =
          item.label?.toLowerCase() ||
          pluckString(l, item.labelKey)?.toLowerCase() ||
          "";
        const allowedMain = isAllowed(item, roleId);

        if (!item.subMenus || item.subMenus.length === 0) {
          if (!qNormalized) return allowedMain ? item : null;
          const isMatchMain = qNormalized && labelMain.includes(qNormalized);
          return allowedMain && isMatchMain ? item : null;
        }

        const subsFilteredByRole = item.subMenus
          .map((sub) => ({
            ...sub,
            list: (sub.list ?? []).filter((subItem) =>
              isAllowed(subItem, roleId),
            ),
          }))
          .filter((s) => (s.list ?? []).length > 0);

        if (!qNormalized) {
          if (allowedMain)
            return subsFilteredByRole.length > 0
              ? { ...item, subMenus: subsFilteredByRole }
              : { ...item, subMenus: undefined };
          return subsFilteredByRole.length > 0
            ? { ...item, subMenus: subsFilteredByRole }
            : null;
        }

        const isMatchMain = qNormalized && labelMain.includes(qNormalized);

        if (isMatchMain && allowedMain) {
          return subsFilteredByRole.length > 0
            ? { ...item, subMenus: subsFilteredByRole }
            : { ...item, subMenus: undefined };
        }

        const matchedSubs = item.subMenus
          .map((sub) => ({
            ...sub,
            list: (sub.list ?? []).filter((subItem) => {
              if (!isAllowed(subItem, roleId)) return false;
              const subLabel =
                subItem.label?.toLowerCase() ||
                pluckString(l, subItem.labelKey)?.toLowerCase() ||
                "";
              return qNormalized && subLabel.includes(qNormalized);
            }),
          }))
          .filter((s) => (s.list ?? []).length > 0);

        return matchedSubs.length > 0
          ? { ...item, subMenus: matchedSubs }
          : null;
      })
      .filter(Boolean) as typeof nav.list;

    return filteredList.length > 0 ? { ...nav, list: filteredList } : null;
  }).filter(Boolean) as typeof PRIVATE_NAVS;

  useEffect(() => {
    if (!navsExpanded) {
      setSearch("");
    } else {
      searchInputRef.current?.focus();
    }
  }, [navsExpanded]);

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
        w={navsExpanded ? "250px" : "60px"}
        borderColor={"border.muted"}
        bg={navsExpanded ? DESKTOP_NAVS_BG : "body"}
        transition={"200ms"}
      >
        {/* Logo & Sidebar Toggle */}
        <CContainer gap={1} px={3} py={2}>
          {!navsExpanded && (
            <NavLink to="/">
              <Center w={"36px"} h={"40px"} mr={"auto"}>
                <Logo size={15} />
              </Center>
            </NavLink>
          )}

          <HStack justify={"space-between"} h={"40px"}>
            {navsExpanded && (
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
              content={navsExpanded ? l.minimize : l.maximize}
              positioning={{
                placement: "right",
                offset: {
                  mainAxis: DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
                },
              }}
            >
              <Btn
                order={navsExpanded ? 2 : 1}
                iconButton
                clicky={false}
                w={"36px"}
                variant={"ghost"}
                colorPalette={NAVS_COLOR_PALETTE}
                onClick={toggleNavsExpanded}
                color={DESKTOP_NAVS_COLOR}
                mt={navsExpanded ? 0 : 3}
                transition={"0"}
              >
                <AppIcon
                  icon={navsExpanded ? SidebarCloseIcon : SidebarOpenIcon}
                />
              </Btn>
            </Tooltip>
          </HStack>
        </CContainer>

        {/* Search */}
        {navsExpanded && (
          <CContainer px={3} pt={2} pb={1}>
            <SearchInput
              inputRef={searchInputRef}
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              queryKey={"q_sidebar_navs"}
            />
          </CContainer>
        )}

        {/* Navs List */}
        <CContainer
          className="scrollY"
          overflowX={"clip"}
          flex={1}
          gap={1}
          p={3}
          pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
        >
          {/* Private Navs */}
          <CContainer gap={1} mt={navsExpanded ? "12px" : 0}>
            {isEmptyArray(resolvedNavs) && <FeedbackNotFound />}

            {!isEmptyArray(resolvedNavs) &&
              resolvedNavs.map((navItem, navItemIdx) => {
                return (
                  <CContainer key={navItemIdx} gap={1}>
                    {navsExpanded && navItem.groupLabelKey && (
                      <ClampText
                        fontSize={"sm"}
                        fontWeight={"semibold"}
                        letterSpacing={"wide"}
                        color={"fg.subtle"}
                        ml={1}
                      >
                        {pluckString(l, navItem.groupLabelKey)}
                      </ClampText>
                    )}

                    {navItem.list.map((nav) => {
                      const hasSubMenus = nav.subMenus;
                      const isMainNavsActive = pathname.includes(nav.path);

                      return (
                        <Fragment key={nav.path}>
                          {!hasSubMenus && (
                            <NavLink key={nav.path} to={nav.path} w={"full"}>
                              <DesktopNavTooltip
                                content={pluckString(l, nav.labelKey)}
                              >
                                <Btn
                                  iconButton={navsExpanded ? false : true}
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

                                  {navsExpanded && (
                                    <P lineClamp={1} textAlign={"left"}>
                                      {pluckString(l, nav.labelKey)}
                                    </P>
                                  )}
                                </Btn>
                              </DesktopNavTooltip>
                            </NavLink>
                          )}

                          {hasSubMenus && (
                            <>
                              {!navsExpanded && (
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
                                        : pluckString(l, nav.labelKey)
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
                                    {nav.subMenus?.map(
                                      (menuItem, menuItemIdx) => (
                                        <MenuItemGroup
                                          key={menuItemIdx}
                                          gap={1}
                                          title={
                                            menuItem.groupLabelKey
                                              ? pluckString(
                                                  l,
                                                  menuItem.groupLabelKey,
                                                )
                                              : ""
                                          }
                                        >
                                          {menuItem.list.map((menu) => {
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
                                                          l,
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
                                                            l,
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

                              {navsExpanded && (
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
                                      content={pluckString(l, nav.labelKey)}
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
                                              : pluckString(l, nav.labelKey)}
                                          </P>
                                        </HStack>
                                      </Btn>
                                    </DesktopNavTooltip>

                                    <AccordionItemContent p={0}>
                                      <CContainer gap={1} pt={1}>
                                        {nav.subMenus?.map(
                                          (menuItem, menuItemIdx) => (
                                            <CContainer
                                              key={menuItemIdx}
                                              gap={1}
                                            >
                                              {menuItem.groupLabelKey && (
                                                <ClampText
                                                  fontSize="sm"
                                                  fontWeight="semibold"
                                                  color="fg.subtle"
                                                  ml={9}
                                                  mt={1}
                                                >
                                                  {pluckString(
                                                    l,
                                                    menuItem.groupLabelKey,
                                                  )}
                                                </ClampText>
                                              )}

                                              {menuItem.list.map(
                                                (menu, idx) => {
                                                  const isFirstIdx = idx === 0;
                                                  const isLastIdx =
                                                    idx ===
                                                    menuItem.list.length - 1;
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
                                                                l,
                                                                menu.labelKey,
                                                              )
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
                                                                : pluckString(
                                                                    l,
                                                                    menu.labelKey,
                                                                  )}
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
            {/* {OTHER_PRIVATE_NAVS[0].list.map((nav) => {
              return (
                <NavLink key={nav.path} to={nav.path} w={"full"}>
                  <DesktopNavTooltip content={pluckString(l, nav.labelKey)}>
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

                      {navsExpanded && (
                        <P lineClamp={1} textAlign={"left"}>
                          {pluckString(l, nav.labelKey)}
                        </P>
                      )}
                    </Btn>
                  </DesktopNavTooltip>
                </NavLink>
              );
            })} */}

            <NavLink key={"/master-data"} to={"/master-data"} w={"full"}>
              <DesktopNavTooltip content={pluckString(l, "navs.master_data")}>
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

                  <AppIcon icon={DatabaseIcon} />

                  {navsExpanded && (
                    <P lineClamp={1} textAlign={"left"}>
                      {pluckString(l, "navs.master_data")}
                    </P>
                  )}
                </Btn>
              </DesktopNavTooltip>
            </NavLink>
          </CContainer>
        </CContainer>

        <CContainer px={3}>
          <Divider />
        </CContainer>

        <CContainer p={3}>
          <MiniMyProfilePopoverTrigger w={"full"}>
            <HStack
              gap={4}
              w={navsExpanded ? "full" : "36px"}
              px={"6px"}
              py={2}
              rounded={themeConfig.radii.component}
              cursor={"pointer"}
              _hover={{
                bg: "gray.subtle",
              }}
              justify={navsExpanded ? "" : "center"}
              transition={"200ms"}
              pos={"relative"}
            >
              <Avatar
                src={imgUrl(user?.avatar?.filePath)}
                name={user?.name}
                size={navsExpanded ? "md" : "2xs"}
                mr={"auto"}
              />

              {navsExpanded && (
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
          </MiniMyProfilePopoverTrigger>
        </CContainer>
      </CContainer>

      {/* Content */}
      <CContainer
        bg={DESKTOP_CONTENT_CONTAINER_BG}
        overflowY={"auto"}
        color={"ibody"}
      >
        <CContainer
          flex={1}
          bg={"body"}
          // borderLeft={"1px solid"}
          borderColor={"border.muted"}
          overflow={"auto"}
        >
          <TopBar
          // borderBottom={"1px solid"} borderColor={"border.muted"}
          />

          {children}
        </CContainer>
      </CContainer>
    </HStack>
  );
};

export default function Layout(props: Props__Layout) {
  // Toggle auth guard
  const ENABLE_AUTH_GUARD = process.env.NEXT_PUBLIC_ENV !== "development";

  // Props
  const { ...restProps } = props;

  // Context / stores
  const authToken = getAccessToken();
  const verifiedAuthToken = useAuthMiddleware((s) => s.verifiedAuthToken);
  const setRole = useAuthMiddleware((s) => s.setRole);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setVerifiedAuthToken = useAuthMiddleware((s) => s.setVerifiedAuthToken);

  // Refs
  const verificationStartedRef = useRef(false);

  // Hooks
  const iss = useIsSmScreenWidth();
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "user-profile",
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  // If guard disabled -> render directly
  if (!ENABLE_AUTH_GUARD) {
    return (
      <CContainer id="app_layout" h={"100dvh"} {...restProps}>
        {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
      </CContainer>
    );
  }

  // If there's no token at all -> redirect immediately
  if (!authToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  // If token exists but not verified yet
  if (authToken && !verifiedAuthToken) {
    if (!verificationStartedRef.current) {
      verificationStartedRef.current = true;

      const config = { method: "GET", url: USER_PROFILE_URL };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            const user = r.data.data;
            setAccessToken(authToken);
            setUserData(user);
            setVerifiedAuthToken(authToken);
            setRole(user?.role);
            setPermissions(user?.role?.permissions);
          },
          onError: () => {
            setVerifiedAuthToken(null);
          },
        },
      });
    }

    return <VerifyingScreen />;
  }

  // If request hook reports loading
  if (loading) {
    return <VerifyingScreen />;
  }

  // After verification, if still invalid -> redirect
  if (!verifiedAuthToken) {
    router.replace("/");
    return <VerifyingScreen />;
  }

  return (
    <CContainer id="app_layout" h={"100dvh"} {...restProps}>
      {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
    </CContainer>
  );
}
