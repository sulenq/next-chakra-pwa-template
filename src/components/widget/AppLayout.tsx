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
import { ColorModeButton } from "@/components/ui/color-mode";
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
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import BackButton from "@/components/widget/BackButton";
import Clock from "@/components/widget/Clock";
import { DotIndicator, LeftIndicator } from "@/components/widget/Indicator";
import Logo from "@/components/widget/Logo";
import { MiniProfile } from "@/components/widget/MiniProfile";
import { APP } from "@/constants/_meta";
import { NAVS } from "@/constants/navs";
import useLang from "@/context/useLang";
import useNavs from "@/context/useNavs";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { last } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { formatDate } from "@/utils/formatter";
import { pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { Center, HStack, Icon, Stack, StackProps } from "@chakra-ui/react";
import {
  IconBoxAlignLeft,
  IconCircleFilled,
  IconSelector,
  IconSettings,
  IconSlash,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

const NAVS_BG = "body";
const NAVS_COLOR = "ibody";
const NAVS_COLOR_PALETTE = "gray";
const BG_CONTENT_CONTAINER = "bgContent";
const DESKTOP_POPUP_MAIN_AXIS = 16;

export const NavTooltip = (props: TooltipProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Tooltip
      positioning={{
        placement: "right",
        offset: {
          mainAxis: DESKTOP_POPUP_MAIN_AXIS,
        },
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};
export const MobileLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <CContainer flex={1} {...restProps}>
      {/* Content */}
      <CContainer flex={1} bg={BG_CONTENT_CONTAINER}>
        {children}
      </CContainer>

      {/* Navs */}
      <HStack bg={"yellow"}></HStack>
    </CContainer>
  );
};
export const DesktopLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const navsExpanded = useNavs((s) => s.navsExpanded);
  const toggleNavsExpanded = useNavs((s) => s.toggleNavsExpanded);

  // Hooks
  const pathname = usePathname();

  // States
  const user = getUserData();
  const activeNavs = getActiveNavs(pathname);

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
        w={navsExpanded ? "250px" : "58px"}
        gap={8}
        p={2}
        transition={"200ms"}
      >
        <CContainer gap={1}>
          {!navsExpanded && (
            <NavLink to="/">
              <Btn
                iconButton
                clicky={false}
                variant={"ghost"}
                colorPalette={NAVS_COLOR_PALETTE}
                w={"42px"}
                mr={"auto"}
              >
                <Logo size={15} />
              </Btn>
            </NavLink>
          )}

          <HStack justify={"space-between"}>
            {navsExpanded && (
              <NavLink to="/">
                <HStack ml={"10px"}>
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

            <Stack flexDir={navsExpanded ? "row" : "column"} gap={1}>
              {/* Toggle Side Navs */}
              <Tooltip
                content={navsExpanded ? l.minimize : l.maximize}
                positioning={{
                  placement: "right",
                  offset: {
                    mainAxis: DESKTOP_POPUP_MAIN_AXIS,
                  },
                }}
              >
                <Btn
                  order={navsExpanded ? 2 : 1}
                  iconButton
                  clicky={false}
                  w={"42px"}
                  variant={"ghost"}
                  colorPalette={NAVS_COLOR_PALETTE}
                  onClick={toggleNavsExpanded}
                >
                  <Icon boxSize={5}>
                    <IconBoxAlignLeft stroke={1.5} />
                  </Icon>
                </Btn>
              </Tooltip>
            </Stack>
          </HStack>
        </CContainer>

        {/* Navs */}
        <CContainer gap={1}>
          {NAVS.map((navItem, navItemIdx) => {
            return (
              <CContainer key={navItemIdx} gap={1}>
                {navsExpanded && navItem.groupLabelKey && (
                  <P
                    fontSize={"xs"}
                    fontWeight={"semibold"}
                    letterSpacing={"wide"}
                    opacity={0.4}
                    ml={3}
                  >
                    {pluckString(l, navItem.groupLabelKey)}
                  </P>
                )}

                {navItem.list.map((nav) => {
                  const hasSubMenus = nav.subMenus;
                  const isMainNavsActive = pathname.includes(nav.path);

                  return (
                    <Fragment key={nav.path}>
                      {hasSubMenus && navsExpanded && (
                        <AccordionRoot multiple>
                          <AccordionItem
                            value={nav.path}
                            border={"none"}
                            rounded={themeConfig.radii.component}
                            _open={{
                              bg: "d0",
                            }}
                          >
                            <NavTooltip
                              key={nav.path}
                              content={pluckString(l, nav.labelKey)}
                            >
                              <AccordionItemTrigger
                                h={"40px"}
                                px={"10.5px"}
                                _hover={{
                                  bg: "gray.subtle",
                                }}
                                pos={"relative"}
                                cursor={"pointer"}
                                transition={"200ms"}
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
                              </AccordionItemTrigger>
                            </NavTooltip>

                            <AccordionItemContent p={0}>
                              <CContainer gap={1} p={1}>
                                {nav.subMenus?.map((menuItem, menuItemIdx) => {
                                  return (
                                    <CContainer key={menuItemIdx} gap={1}>
                                      {menuItem.groupLabelKey && (
                                        <P
                                          fontSize={"xs"}
                                          fontWeight={"semibold"}
                                          opacity={0.6}
                                          ml={"12px"}
                                          mt={1}
                                        >
                                          {pluckString(
                                            l,
                                            menuItem.groupLabelKey
                                          )}
                                        </P>
                                      )}

                                      {menuItem.list.map((menu) => {
                                        const isSubNavsActive =
                                          pathname === menu.path;

                                        return (
                                          <NavLink
                                            key={menu.path}
                                            to={menu.path}
                                          >
                                            <Btn
                                              iconButton={
                                                navsExpanded ? false : true
                                              }
                                              clicky={false}
                                              w={"full"}
                                              gap={4}
                                              px={"6px"}
                                              rounded={`calc(${themeConfig.radii.component} - 2px)`}
                                              justifyContent={"start"}
                                              variant={"ghost"}
                                              colorPalette={NAVS_COLOR_PALETTE}
                                            >
                                              <Center boxSize={5}>
                                                <Icon
                                                  boxSize={2}
                                                  color={
                                                    isSubNavsActive
                                                      ? themeConfig.primaryColor
                                                      : "d2"
                                                  }
                                                >
                                                  <IconCircleFilled
                                                    stroke={1.5}
                                                  />
                                                </Icon>
                                              </Center>

                                              <P
                                                lineClamp={1}
                                                textAlign={"left"}
                                              >
                                                {pluckString(l, menu.labelKey)}
                                              </P>
                                            </Btn>
                                          </NavLink>
                                        );
                                      })}
                                    </CContainer>
                                  );
                                })}
                              </CContainer>
                            </AccordionItemContent>
                          </AccordionItem>
                        </AccordionRoot>
                      )}

                      {hasSubMenus && !navsExpanded && (
                        <MenuRoot
                          positioning={{
                            placement: "right-start",
                            offset: {
                              mainAxis: DESKTOP_POPUP_MAIN_AXIS,
                            },
                          }}
                        >
                          <NavTooltip content={pluckString(l, nav.labelKey)}>
                            <CContainer>
                              <MenuTrigger asChild>
                                <Btn
                                  iconButton
                                  clicky={false}
                                  h={"40px"}
                                  px={"10px"}
                                  justifyContent={"start"}
                                  variant={"ghost"}
                                  colorPalette={NAVS_COLOR_PALETTE}
                                  pos={"relative"}
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
                                      ? pluckString(l, menuItem.groupLabelKey)
                                      : ""
                                  }
                                >
                                  {menuItem.list.map((menu) => {
                                    const isSubNavsActive =
                                      pathname === menu.path;

                                    return (
                                      <NavLink key={menu.path} to={menu.path}>
                                        <MenuItem value={menu.path}>
                                          {pluckString(l, menu.labelKey)}

                                          {isSubNavsActive && (
                                            <DotIndicator mr={1} />
                                          )}
                                        </MenuItem>
                                      </NavLink>
                                    );
                                  })}
                                </MenuItemGroup>
                              );
                            })}
                          </MenuContent>
                        </MenuRoot>
                      )}

                      {!hasSubMenus && (
                        <NavLink key={nav.path} to={nav.path}>
                          <NavTooltip content={pluckString(l, nav.labelKey)}>
                            <Btn
                              iconButton={navsExpanded ? false : true}
                              clicky={false}
                              h={"40px"}
                              gap={4}
                              px={"10px"}
                              justifyContent={"start"}
                              variant={"ghost"}
                              colorPalette={NAVS_COLOR_PALETTE}
                            >
                              {isMainNavsActive && <LeftIndicator />}

                              <Icon boxSize={5}>
                                <nav.icon stroke={1.5} />
                              </Icon>

                              {navsExpanded && (
                                <P lineClamp={1} textAlign={"left"}>
                                  {pluckString(l, nav.labelKey)}
                                </P>
                              )}
                            </Btn>
                          </NavTooltip>
                        </NavLink>
                      )}
                    </Fragment>
                  );
                })}
              </CContainer>
            );
          })}
        </CContainer>

        <CContainer mt={"auto"} gap={2}>
          <NavLink to={"/admin/settings"}>
            <NavTooltip content={l.settings}>
              <Btn
                clicky={false}
                gap={4}
                justifyContent={"start"}
                variant={"ghost"}
                colorPalette={NAVS_COLOR_PALETTE}
                px={"10px"}
                pos={"relative"}
              >
                {pathname.includes("/admin/settings") && <LeftIndicator />}

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

          <Divider />

          <PopoverRoot
            positioning={{
              placement: "right-end",
              offset: { mainAxis: DESKTOP_POPUP_MAIN_AXIS },
            }}
          >
            <PopoverTrigger asChild>
              <HStack
                gap={4}
                px={navsExpanded ? "10px" : "9px"}
                py={2}
                rounded={themeConfig.radii.component}
                cursor={"pointer"}
                _hover={{
                  bg: "gray.subtle",
                }}
                transition={"200ms"}
                pos={"relative"}
              >
                {pathname.includes("/admin/profile") && <LeftIndicator />}

                <Avatar
                  src={user?.photoProfile?.file_url}
                  name={user?.name}
                  size={navsExpanded ? "xs" : "2xs"}
                />

                {navsExpanded && (
                  <>
                    <CContainer>
                      <P lineClamp={1} fontWeight={"semibold"}>
                        {user?.name || "Signed out"}
                      </P>
                      <P lineClamp={1} opacity={0.6}>
                        {user?.email || user?.username || "-"}
                      </P>
                    </CContainer>

                    <Icon opacity={0.6} boxSize={5}>
                      <IconSelector stroke={1.5} />
                    </Icon>
                  </>
                )}
              </HStack>
            </PopoverTrigger>

            <PopoverContent w={"200px"} zIndex={2}>
              <MiniProfile />
            </PopoverContent>
          </PopoverRoot>
        </CContainer>
      </CContainer>

      {/* Content */}
      <CContainer bg={BG_CONTENT_CONTAINER} overflowY={"auto"}>
        {/* Content Header */}
        <HStack gap={4} h={"52px"} p={4} justify={"space-between"}>
          <HStack>
            {last(activeNavs)?.backPath && (
              <BackButton iconButton clicky={false} />
            )}

            {activeNavs.map((nav, idx) => {
              return (
                <HStack key={idx}>
                  {idx !== 0 && (
                    <Icon boxSize={5} color={"fg.subtle"}>
                      <IconSlash stroke={1.5} />
                    </Icon>
                  )}

                  <P
                    fontSize={16}
                    fontWeight={"semibold"}
                    ml={idx === 0 ? 1 : 0}
                  >
                    {pluckString(l, nav.labelKey)}
                  </P>
                </HStack>
              );
            })}
          </HStack>

          <HStack gap={1}>
            <ColorModeButton size={"xs"} />

            <HStack mx={1}>
              <P>{formatDate(new Date().toDateString())}</P>

              <Clock w={"42px"} textAlign={"center"} />
            </HStack>
          </HStack>
        </HStack>

        <CContainer flex={1} overflowY={"auto"}>
          {children}
        </CContainer>
      </CContainer>
    </HStack>
  );
};

export const AppLayout = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer id="app_layout" h={"100dvh"} {...restProps}>
      {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
    </CContainer>
  );
};
