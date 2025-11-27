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
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import Clock from "@/components/widget/Clock";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import HScroll from "@/components/widget/HScroll";
import { BottomIndicator, LeftIndicator } from "@/components/widget/Indicator";
import Logo from "@/components/widget/Logo";
import { MiniMyProfile } from "@/components/widget/MiniMyProfile";
import { Today } from "@/components/widget/Today";
import { NavBreadcrumb, TopBar } from "@/components/widget/TopBar";
import { VerifyingScreen } from "@/components/widget/VerifyingScreen";
import { APP } from "@/constants/_meta";
import { PRIVATE_NAVS } from "@/constants/navs";
import { Props__Layout, Props__NavLink } from "@/constants/props";
import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX } from "@/constants/sizes";
import useAuthMiddleware from "@/context/useAuthMiddleware";
import useLang from "@/context/useLang";
import useNavs from "@/context/useNavs";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useRequest from "@/hooks/useRequest";
import useScreen from "@/hooks/useScreen";
import { isEmptyArray, last } from "@/utils/array";
import { getAuthToken, getUserData } from "@/utils/auth";
import { setStorage } from "@/utils/client";
import { pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { Box, Center, HStack, Icon } from "@chakra-ui/react";
import {
  IconBoxAlignLeft,
  IconCircleFilled,
  IconDatabase,
  IconSelector,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

const NAVS_BG = "body";
const NAVS_COLOR = "ibody";
const NAVS_COLOR_PALETTE = "gray";
const BG_CONTENT_CONTAINER = "body";
const DESKTOP_POPOVER_MAIN_AXIS = 24;
const DESKTOP_TOOLTIP_MAIN_AXIS = 24;
const MOBILE_NAV_LABEL_FONT_SIZE = "sm";
const MOBILE_POPOVER_MAIN_AXIS = 22;

const NavTooltip = (props: TooltipProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Tooltip
      positioning={{
        placement: "right",
        offset: {
          mainAxis: DESKTOP_TOOLTIP_MAIN_AXIS,
        },
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};
const MobileNavLink = (props: Props__NavLink) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <NavLink
      minW={"50px"}
      align={"center"}
      gap={1}
      pos={"relative"}
      {...restProps}
    >
      {children}
    </NavLink>
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
  const isInSettingsRoute = pathname.includes(`/settings`);
  const isInMasterDataRoute = pathname.includes(`/master-data`);
  const isInProfileRoute = pathname.includes(`/profile`);

  return (
    <CContainer flex={1} overflowY={"auto"} {...restProps}>
      {/* Content */}
      <CContainer flex={1} bg={BG_CONTENT_CONTAINER} overflowY={"auto"}>
        {/* Content header */}
        <CContainer>
          <HStack w={"full"} justify={"space-between"} pt={2} px={4}>
            <HStack>
              <Logo size={15} />
            </HStack>

            <HStack>
              <Clock showTimezone={sw > 320} />

              <Today dateVariant="numeric" />
            </HStack>
          </HStack>

          <HStack gap={4} h={"52px"} p={4} justify={"space-between"}>
            <NavBreadcrumb
              backPath={backPath}
              resolvedActiveNavs={resolvedActiveNavs}
              ml={backPath ? -1 : 0}
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
                {navItem.list.map((nav) => {
                  const isMainNavActive = pathname.includes(nav.path);

                  return (
                    <Fragment key={nav.path}>
                      {!nav.subMenus && (
                        <MobileNavLink
                          key={nav.path}
                          to={nav.subMenus ? "" : nav.path}
                          color={isMainNavActive ? "" : "fg.muted"}
                          flex={1}
                        >
                          <Icon boxSize={6}>
                            <nav.icon stroke={1.5} />
                          </Icon>

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
                                <Icon boxSize={6}>
                                  <nav.icon stroke={1.5} />
                                </Icon>

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
                                        ? pluckString(l, menuItem.groupLabelKey)
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
                  );
                })}
              </Fragment>
            );
          })}

          <MobileNavLink
            to={`/master-data`}
            color={isInMasterDataRoute ? "" : "fg.muted"}
            flex={1}
          >
            <Icon boxSize={6}>
              <IconDatabase stroke={1.5} />
            </Icon>

            <P
              textAlign={"center"}
              lineClamp={1}
              fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
            >
              Master Data
            </P>

            {isInMasterDataRoute && <BottomIndicator />}
          </MobileNavLink>

          <MobileNavLink
            to={`/settings`}
            color={isInSettingsRoute ? "" : "fg.muted"}
            flex={1}
          >
            <Icon boxSize={6}>
              <IconSettings stroke={1.5} />
            </Icon>

            <P
              textAlign={"center"}
              lineClamp={1}
              fontSize={MOBILE_NAV_LABEL_FONT_SIZE}
            >
              {l.settings}
            </P>

            {isInSettingsRoute && <BottomIndicator />}
          </MobileNavLink>

          <PopoverRoot
            positioning={{
              placement: "top",
              offset: {
                mainAxis: MOBILE_POPOVER_MAIN_AXIS,
              },
            }}
          >
            <PopoverTrigger asChild>
              <MobileNavLink flex={1} color={"fg.muted"}>
                {!user?.avatar?.filePath && (
                  <Icon boxSize={6}>
                    <IconUser stroke={1.5} />
                  </Icon>
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
                  color={isInProfileRoute ? "" : "fg.muted"}
                  lineClamp={1}
                >
                  {l.profile}
                </P>
              </MobileNavLink>
            </PopoverTrigger>

            <PopoverContent w={"200px"} zIndex={10}>
              <MiniMyProfile />
            </PopoverContent>
          </PopoverRoot>
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
  const resolvedNavs = PRIVATE_NAVS.map((nav) => {
    // Case 1: search is empty
    if (!q) {
      const filteredList = nav.list
        .map((item) => {
          if (item.subMenus && item.subMenus.length > 0) {
            const filteredSubs = item.subMenus.map((sub) => ({
              ...sub,
              list: (sub.list ?? []).filter(
                (subItem) =>
                  !subItem.allowedRoles ||
                  subItem.allowedRoles.length === 0 ||
                  (roleId && subItem.allowedRoles.includes(roleId))
              ),
            }));

            const hasSubs = filteredSubs.some((s) => s.list.length > 0);
            return hasSubs ? { ...item, subMenus: filteredSubs } : null;
          }

          const allowed =
            !item.allowedRoles ||
            item.allowedRoles.length === 0 ||
            (roleId && item.allowedRoles.includes(roleId));

          return allowed ? item : null;
        })
        .filter(Boolean) as typeof nav.list;

      return filteredList.length > 0 ? { ...nav, list: filteredList } : null;
    }

    // Case 2: search has value
    const filteredList = nav.list.flatMap((item) => {
      if (item.subMenus && item.subMenus.length > 0) {
        // return only matched subItems, no parent
        const matchedSubs = item.subMenus.flatMap((sub) =>
          (sub.list ?? []).filter((subItem) => {
            const allowed =
              !subItem.allowedRoles ||
              subItem.allowedRoles.length === 0 ||
              (roleId && subItem.allowedRoles.includes(roleId));

            if (!allowed) return false;
            return pluckString(l, subItem.labelKey)?.toLowerCase().includes(q);
          })
        );

        return matchedSubs;
      }

      const allowed =
        !item.allowedRoles ||
        item.allowedRoles.length === 0 ||
        (roleId && item.allowedRoles.includes(roleId));

      const matches =
        allowed && pluckString(l, item.labelKey)?.toLowerCase().includes(q);

      return matches ? [item] : [];
    });

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
      bg={NAVS_BG}
      color={NAVS_COLOR}
      overflowY={"auto"}
      {...restProps}
    >
      {/* Sidebar */}
      <CContainer
        flexShrink={0}
        w={navsExpanded ? "250px" : "60px"}
        transition={"200ms"}
        borderRight={"1px solid"}
        borderColor={"border.muted"}
      >
        <CContainer gap={1} px={3} py={2}>
          {!navsExpanded && (
            <NavLink to="/">
              <Center w={"36px"} h={"40px"} mr={"auto"}>
                <Logo size={15} />
              </Center>
            </NavLink>
          )}

          <HStack justify={"space-between"}>
            {navsExpanded && (
              <NavLink to="/">
                <HStack ml={"8px"} gap={3}>
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
                  mainAxis: DESKTOP_TOOLTIP_MAIN_AXIS,
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
                mr={navsExpanded ? "-3px" : ""}
              >
                <Icon boxSize={5}>
                  <IconBoxAlignLeft stroke={1.5} />
                </Icon>
              </Btn>
            </Tooltip>
          </HStack>
        </CContainer>

        {/* Navs */}
        {navsExpanded && (
          <CContainer p={3} pb={1}>
            <SearchInput
              inputRef={searchInputRef}
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
            />
          </CContainer>
        )}

        <CContainer
          className="scrollY"
          flex={1}
          p={3}
          pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
        >
          <CContainer gap={1}>
            {isEmptyArray(resolvedNavs) && <FeedbackNotFound />}

            {!isEmptyArray(resolvedNavs) &&
              resolvedNavs.map((navItem, navItemIdx) => {
                return (
                  <CContainer key={navItemIdx} gap={1}>
                    {navsExpanded && navItem.groupLabelKey && (
                      <P
                        fontSize={"sm"}
                        fontWeight={"semibold"}
                        letterSpacing={"wide"}
                        color={"fg.subtle"}
                        ml={"10px"}
                      >
                        {pluckString(l, navItem.groupLabelKey)}
                      </P>
                    )}

                    {navItem.list.map((nav) => {
                      const hasSubMenus = nav.subMenus;
                      const isMainNavsActive = pathname.includes(nav.path);

                      return (
                        <Fragment key={nav.path}>
                          {!hasSubMenus && (
                            <NavLink key={nav.path} to={nav.path} w={"full"}>
                              <NavTooltip
                                content={pluckString(l, nav.labelKey)}
                              >
                                <Btn
                                  iconButton={navsExpanded ? false : true}
                                  clicky={false}
                                  gap={4}
                                  px={2}
                                  justifyContent={"start"}
                                  variant={"ghost"}
                                  // color={
                                  //   isMainNavsActive
                                  //     ? `${themeConfig.colorPalette}.fg`
                                  //     : ""
                                  // }
                                >
                                  {isMainNavsActive && nav.icon && (
                                    <LeftIndicator />
                                  )}

                                  {nav.icon && (
                                    <Icon boxSize={5}>
                                      <nav.icon stroke={1.5} />
                                    </Icon>
                                  )}

                                  {!nav.icon && (
                                    <Icon
                                      boxSize={2}
                                      color={
                                        isMainNavsActive
                                          ? themeConfig.primaryColor
                                          : "d2"
                                      }
                                    >
                                      <IconCircleFilled stroke={1.5} />
                                    </Icon>
                                  )}

                                  {navsExpanded && (
                                    <P lineClamp={1} textAlign={"left"}>
                                      {pluckString(l, nav.labelKey)}
                                    </P>
                                  )}
                                </Btn>
                              </NavTooltip>
                            </NavLink>
                          )}

                          {hasSubMenus && !navsExpanded && (
                            <MenuRoot
                              positioning={{
                                placement: "right-start",
                                offset: {
                                  mainAxis: DESKTOP_POPOVER_MAIN_AXIS,
                                },
                              }}
                            >
                              <NavTooltip
                                content={pluckString(l, nav.labelKey)}
                              >
                                <CContainer>
                                  <MenuTrigger asChild>
                                    <Btn
                                      iconButton
                                      clicky={false}
                                      px={2}
                                      justifyContent={"start"}
                                      variant={"ghost"}
                                      colorPalette={NAVS_COLOR_PALETTE}
                                      pos={"relative"}
                                      // color={
                                      //   isMainNavsActive
                                      //     ? `${themeConfig.colorPalette}.fg`
                                      //     : ""
                                      // }
                                    >
                                      {isMainNavsActive && <LeftIndicator />}

                                      <Icon boxSize={5}>
                                        <nav.icon stroke={1.5} />
                                      </Icon>
                                    </Btn>
                                  </MenuTrigger>
                                </CContainer>
                              </NavTooltip>

                              <MenuContent>
                                {nav.subMenus?.map((menuItem, menuItemIdx) => {
                                  return (
                                    <MenuItemGroup
                                      key={menuItemIdx}
                                      gap={1}
                                      title={
                                        menuItem.groupLabelKey
                                          ? pluckString(
                                              l,
                                              menuItem.groupLabelKey
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
                                            w={"full"}
                                          >
                                            <Tooltip
                                              content={pluckString(
                                                l,
                                                menu.labelKey
                                              )}
                                              positioning={{
                                                placement: "right",
                                                offset: {
                                                  mainAxis: 12,
                                                },
                                              }}
                                            >
                                              <MenuItem
                                                value={menu.path}
                                                px={3}
                                                // color={
                                                //   isSubNavsActive
                                                //     ? `${themeConfig.colorPalette}.fg`
                                                //     : ""
                                                // }
                                              >
                                                {isSubNavsActive && (
                                                  <LeftIndicator />
                                                )}

                                                <P lineClamp={1}>
                                                  {pluckString(
                                                    l,
                                                    menu.labelKey
                                                  )}
                                                </P>
                                              </MenuItem>
                                            </Tooltip>
                                          </NavLink>
                                        );
                                      })}
                                    </MenuItemGroup>
                                  );
                                })}
                              </MenuContent>
                            </MenuRoot>
                          )}

                          {hasSubMenus && navsExpanded && (
                            <AccordionRoot multiple>
                              <AccordionItem
                                value={nav.path}
                                border={"none"}
                                rounded={themeConfig.radii.component}
                                _open={{
                                  bg: "transparent",
                                }}
                              >
                                <NavTooltip
                                  key={nav.path}
                                  content={pluckString(l, nav.labelKey)}
                                >
                                  <Btn
                                    as={AccordionItemTrigger}
                                    clicky={false}
                                    variant={"ghost"}
                                    px={2}
                                    pr={"10px"}
                                    pos={"relative"}
                                    bg={"transparent"}
                                    // color={
                                    //   isMainNavsActive
                                    //     ? `${themeConfig.colorPalette}.fg`
                                    //     : ""
                                    // }
                                    _hover={{
                                      bg: "bg.muted",
                                    }}
                                  >
                                    {isMainNavsActive && <LeftIndicator />}

                                    <HStack gap={4}>
                                      <Icon boxSize={5}>
                                        <nav.icon stroke={1.5} />
                                      </Icon>

                                      <P lineClamp={1} textAlign={"left"}>
                                        {pluckString(l, nav.labelKey)}
                                      </P>
                                    </HStack>
                                  </Btn>
                                </NavTooltip>

                                <AccordionItemContent p={0}>
                                  <CContainer gap={1} pt={1}>
                                    {nav.subMenus?.map(
                                      (menuItem, menuItemIdx) => {
                                        return (
                                          <CContainer key={menuItemIdx} gap={1}>
                                            {menuItem.groupLabelKey && (
                                              <P
                                                fontSize={"sm"}
                                                fontWeight={"semibold"}
                                                color={"fg.subtle"}
                                                ml={"12px"}
                                                mt={1}
                                              >
                                                {pluckString(
                                                  l,
                                                  menuItem.groupLabelKey
                                                )}
                                              </P>
                                            )}

                                            {menuItem.list.map((menu, idx) => {
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
                                                  w={"full"}
                                                >
                                                  <Tooltip
                                                    content={pluckString(
                                                      l,
                                                      menu.labelKey
                                                    )}
                                                    positioning={{
                                                      placement: "right",
                                                      offset: {
                                                        mainAxis:
                                                          DESKTOP_TOOLTIP_MAIN_AXIS +
                                                          2,
                                                      },
                                                    }}
                                                  >
                                                    <HStack
                                                      pos={"relative"}
                                                      pl={"8.5px"}
                                                      gap={1}
                                                    >
                                                      {!isFirstIdx && (
                                                        <Box
                                                          flexShrink={0}
                                                          w={"1px"}
                                                          h={"calc(50% + 2px)"}
                                                          pos={"absolute"}
                                                          top={"-2px"}
                                                          left={"18px"}
                                                          bg={"d3"}
                                                        />
                                                      )}
                                                      {!isLastIdx && (
                                                        <Box
                                                          flexShrink={0}
                                                          w={"1px"}
                                                          h={"calc(50% + 2px)"}
                                                          pos={"absolute"}
                                                          bottom={"-2px"}
                                                          left={"18px"}
                                                          bg={"d3"}
                                                        />
                                                      )}

                                                      <Center
                                                        flexShrink={0}
                                                        boxSize={5}
                                                        zIndex={2}
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
                                                        iconButton={
                                                          navsExpanded
                                                            ? false
                                                            : true
                                                        }
                                                        clicky={false}
                                                        flex={1}
                                                        gap={3}
                                                        px={3}
                                                        rounded={`calc(${themeConfig.radii.component})`}
                                                        justifyContent={"start"}
                                                        variant={"ghost"}
                                                        colorPalette={
                                                          NAVS_COLOR_PALETTE
                                                        }
                                                        // color={
                                                        //   isSubNavsActive
                                                        //     ? `${themeConfig.colorPalette}.fg`
                                                        //     : ""
                                                        // }
                                                      >
                                                        <P
                                                          lineClamp={1}
                                                          textAlign={"left"}
                                                        >
                                                          {pluckString(
                                                            l,
                                                            menu.labelKey
                                                          )}
                                                        </P>
                                                      </Btn>
                                                    </HStack>
                                                  </Tooltip>
                                                </NavLink>
                                              );
                                            })}
                                          </CContainer>
                                        );
                                      }
                                    )}
                                  </CContainer>
                                </AccordionItemContent>
                              </AccordionItem>
                            </AccordionRoot>
                          )}
                        </Fragment>
                      );
                    })}
                  </CContainer>
                );
              })}
          </CContainer>

          <CContainer mt={"auto"} gap={2}>
            <NavLink to={`/master-data`} w={"full"}>
              <NavTooltip content={"Master Data"}>
                <Btn
                  clicky={false}
                  gap={4}
                  justifyContent={"start"}
                  variant={"ghost"}
                  colorPalette={NAVS_COLOR_PALETTE}
                  px={2}
                  pos={"relative"}
                >
                  {pathname.includes(`/master-data`) && <LeftIndicator />}

                  <Icon boxSize={5}>
                    <IconDatabase stroke={1.5} />
                  </Icon>

                  {navsExpanded && (
                    <P lineClamp={1} textAlign={"left"}>
                      Master Data
                    </P>
                  )}
                </Btn>
              </NavTooltip>
            </NavLink>

            <NavLink to={`/settings`} w={"full"}>
              <NavTooltip content={l.settings}>
                <Btn
                  clicky={false}
                  gap={4}
                  justifyContent={"start"}
                  variant={"ghost"}
                  colorPalette={NAVS_COLOR_PALETTE}
                  px={2}
                  pos={"relative"}
                >
                  {pathname.includes(`/settings`) && <LeftIndicator />}

                  <Icon boxSize={5}>
                    <IconSettings stroke={1.5} />
                  </Icon>

                  {navsExpanded && (
                    <P lineClamp={1} textAlign={"left"}>
                      {l.settings}
                    </P>
                  )}
                </Btn>
              </NavTooltip>
            </NavLink>
          </CContainer>
        </CContainer>

        <CContainer>
          {navsExpanded && <Divider />}

          <CContainer p={3}>
            <PopoverRoot
              positioning={{
                placement: "right-end",
                offset: { mainAxis: DESKTOP_POPOVER_MAIN_AXIS, crossAxis: 0 },
              }}
            >
              <PopoverTrigger asChild>
                <HStack
                  gap={4}
                  px={navsExpanded ? 2 : "7px"}
                  py={2}
                  rounded={themeConfig.radii.component}
                  cursor={"pointer"}
                  _hover={{
                    bg: "gray.subtle",
                  }}
                  transition={"200ms"}
                  pos={"relative"}
                >
                  {!user?.avatar?.filePath && (
                    <Icon boxSize={5}>
                      <IconUser stroke={1.5} />
                    </Icon>
                  )}

                  {user?.avatar?.filePath && (
                    <Avatar
                      src={imgUrl(user?.avatar?.filePath)}
                      name={user?.name}
                      size={navsExpanded ? "md" : "2xs"}
                    />
                  )}

                  {navsExpanded && (
                    <>
                      <CContainer>
                        <P lineClamp={1} fontWeight={"semibold"}>
                          {user?.name || "Signed out"}
                        </P>
                        <P lineClamp={1} color={"fg.subtle"}>
                          {user?.email || user?.username || "-"}
                        </P>
                      </CContainer>

                      <Icon boxSize={5} color={"fg.subtle"}>
                        <IconSelector stroke={1.5} />
                      </Icon>
                    </>
                  )}
                </HStack>
              </PopoverTrigger>

              <PopoverContent w={"226px"} zIndex={10}>
                <MiniMyProfile />
              </PopoverContent>
            </PopoverRoot>
          </CContainer>
        </CContainer>
      </CContainer>

      {/* Content */}
      <CContainer bg={BG_CONTENT_CONTAINER} overflowY={"auto"} color={"ibody"}>
        <TopBar />

        {children}
      </CContainer>
    </HStack>
  );
};

export default function Layout(props: Props__Layout) {
  // Toggle auth guard
  // const ENABLE_AUTH_GUARD = process.env.NODE_ENV !== "development";
  // TODO remove on real dev and enable above
  const ENABLE_AUTH_GUARD = false;

  // Props
  const { ...restProps } = props;

  // Context / stores
  const authToken = getAuthToken();
  const verifiedAuthToken = useAuthMiddleware((s) => s.verifiedAuthToken);
  const setRole = useAuthMiddleware((s) => s.setRole);
  const setPermissions = useAuthMiddleware((s) => s.setPermissions);
  const setVerifiedAuthToken = useAuthMiddleware((s) => s.setVerifiedAuthToken);

  // Hooks
  const iss = useIsSmScreenWidth();
  const router = useRouter();
  const { req, loading } = useRequest({
    id: "user-profile",
    showLoadingToast: false,
    showSuccessToast: false,
    showErrorToast: false,
  });

  // Refs
  const verificationStartedRef = useRef(false);

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

      const config = { method: "GET", url: "/api/profile/get-user-profile" };

      req({
        config,
        onResolve: {
          onSuccess: (r: any) => {
            const user = r.data.data;
            setStorage("__auth_token", authToken, "local", 259200000);
            setStorage("__user_data", JSON.stringify(user), "local", 259200000);
            setVerifiedAuthToken(authToken);
            setRole(user.role);
            setPermissions(user.role.permissions);
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
