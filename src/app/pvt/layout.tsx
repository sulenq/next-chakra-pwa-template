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
import BackButton from "@/components/widget/BackButton";
import Clock from "@/components/widget/Clock";
import {
  BottomIndicator,
  DotIndicator,
  LeftIndicator,
} from "@/components/widget/Indicator";
import Logo from "@/components/widget/Logo";
import { MiniProfile } from "@/components/widget/MiniProfile";
import { Today } from "@/components/widget/Today";
import { APP } from "@/constants/_meta";
import { NAVS, PRIVATE_ROUTE_INDEX } from "@/constants/navs";
import { Props__NavLink } from "@/constants/props";
import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX } from "@/constants/sizes";
import useLang from "@/context/useLang";
import useNavs from "@/context/useNavs";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useScreen from "@/hooks/useScreen";
import { last } from "@/utils/array";
import { getUserData } from "@/utils/auth";
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
import { Fragment, useState } from "react";

const NAVS_BG = "body";
const NAVS_COLOR = "ibody";
const NAVS_COLOR_PALETTE = "gray";
const BG_CONTENT_CONTAINER = "bgContent";
const DESKTOP_POPUP_MAIN_AXIS = 16;

const NavTooltip = (props: TooltipProps) => {
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

  return (
    <CContainer flex={1} overflowY={"auto"} {...restProps}>
      {/* Content */}
      <CContainer flex={1} bg={BG_CONTENT_CONTAINER} overflowY={"auto"}>
        {/* Content header */}
        <HStack gap={4} h={"52px"} p={4} justify={"space-between"}>
          <HStack>
            {backPath && (
              <BackButton iconButton clicky={false} backPath={backPath} />
            )}

            {resolvedActiveNavs.map((nav, idx) => {
              return (
                <HStack key={idx}>
                  {idx !== 0 && (
                    <>
                      {backPath && (
                        <Icon boxSize={5} color={"fg.subtle"}>
                          <IconSlash stroke={1.5} />
                        </Icon>
                      )}

                      {!backPath && <DotIndicator color={"d4"} />}
                    </>
                  )}

                  <P
                    fontSize={16}
                    fontWeight={"semibold"}
                    ml={idx === 0 ? 1 : 0}
                    lineClamp={1}
                  >
                    {pluckString(l, nav.labelKey)}
                  </P>
                </HStack>
              );
            })}
          </HStack>

          <HStack flexShrink={0} gap={1}>
            <HStack mx={1}>
              {/* <Clock /> */}

              {/* <Today dateVariant="basic" /> */}
            </HStack>
          </HStack>
        </HStack>

        {children}
      </CContainer>

      {/* Navs */}
      <HStack
        gap={4}
        px={4}
        pt={3}
        pb={5}
        borderTop={"1px solid"}
        borderColor={"border.subtle"}
        overflowX={"auto"}
      >
        {NAVS.map((navItem) => {
          return (
            <>
              {navItem.list.map((nav) => {
                const isMainNavActive = pathname.includes(nav.path);

                return (
                  <>
                    {nav.subMenus && (
                      <>
                        <MenuRoot
                          positioning={{
                            placement: "top",
                            offset: {
                              mainAxis: 20,
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
                            >
                              <Icon boxSize={6}>
                                <nav.icon stroke={1.5} />
                              </Icon>

                              <P
                                fontSize={"xs"}
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
                      </>
                    )}

                    {!nav.subMenus && (
                      <MobileNavLink
                        key={nav.path}
                        to={nav.subMenus ? "" : nav.path}
                        color={isMainNavActive ? "" : "fg.muted"}
                      >
                        <Icon boxSize={6}>
                          <nav.icon stroke={1.5} />
                        </Icon>

                        <P textAlign={"center"} lineClamp={1} fontSize={"xs"}>
                          {pluckString(l, nav.labelKey)}
                        </P>

                        {isMainNavActive && <BottomIndicator />}
                      </MobileNavLink>
                    )}
                  </>
                );
              })}
            </>
          );
        })}

        <MobileNavLink
          to={`${PRIVATE_ROUTE_INDEX}/settings`}
          color={
            pathname.includes(`${PRIVATE_ROUTE_INDEX}/settings`)
              ? ""
              : "fg.muted"
          }
        >
          <Icon boxSize={6}>
            <IconSettings stroke={1.5} />
          </Icon>

          <P textAlign={"center"} lineClamp={1} fontSize={"xs"}>
            {l.settings}
          </P>
        </MobileNavLink>

        <PopoverRoot
          positioning={{
            placement: "top",
            offset: {
              mainAxis: 20,
            },
          }}
        >
          <PopoverTrigger asChild>
            <MobileNavLink>
              <Avatar
                src={user?.photoProfile?.fileUrl}
                name={user?.name}
                size={"2xs"}
              />

              <P
                fontSize={"xs"}
                textAlign={"center"}
                color={
                  pathname.includes(`${PRIVATE_ROUTE_INDEX}/profile`)
                    ? ""
                    : "fg.muted"
                }
                lineClamp={1}
              >
                {l.my_profile}
              </P>
            </MobileNavLink>
          </PopoverTrigger>

          <PopoverContent w={"200px"} zIndex={2}>
            <MiniProfile />
          </PopoverContent>
        </PopoverRoot>
      </HStack>
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

  // Hooks
  const pathname = usePathname();
  const { sw } = useScreen();

  // States
  const user = getUserData();
  const activeNavs = getActiveNavs(pathname);
  const resolvedActiveNavs =
    sw < 960 ? [activeNavs[activeNavs.length - 1]] : activeNavs;
  const backPath = last(activeNavs)?.backPath;
  const [search, setSearch] = useState<string>("");
  const resolvedNavs = NAVS.map((nav) => {
    const filteredList = nav.list.flatMap((item) => {
      const isMatch =
        item.path &&
        pluckString(l, item.labelKey)
          .toLowerCase()
          .includes(search.toLowerCase());

      if (isMatch) return [item];

      if (item.subMenus) {
        const matchedSubs = item.subMenus.flatMap((sub) =>
          sub.list.filter((subItem) =>
            pluckString(l, subItem.labelKey)
              .toLowerCase()
              .includes(search.toLowerCase())
          )
        );

        return matchedSubs.length > 0 ? matchedSubs : [];
      }

      return [];
    });

    return filteredList.length > 0 ? { ...nav, list: filteredList } : null;
  }).filter(Boolean) as typeof NAVS;

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
        w={navsExpanded ? "250px" : "54px"}
        gap={6}
        transition={"200ms"}
      >
        <CContainer gap={1} p={2}>
          {!navsExpanded && (
            <NavLink to="/">
              <Btn
                iconButton
                clicky={false}
                variant={"ghost"}
                colorPalette={NAVS_COLOR_PALETTE}
                w={"40px"}
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
                  w={"40px"}
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
        <CContainer
          className={"scrollY"}
          gap={1}
          p={2}
          pr={`calc(8px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
        >
          {navsExpanded && (
            <CContainer mb={1}>
              <SearchInput
                inputProps={{ variant: "flushed", rounded: 0 }}
                inputValue={search}
                onChange={(inputValue) => {
                  setSearch(inputValue || "");
                }}
              />
            </CContainer>
          )}

          {resolvedNavs.map((navItem, navItemIdx) => {
            return (
              <CContainer key={navItemIdx} gap={1}>
                {navsExpanded && navItem.groupLabelKey && (
                  <P
                    fontSize={"xs"}
                    fontWeight={"semibold"}
                    letterSpacing={"wide"}
                    opacity={0.4}
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
                                h={"36px"}
                                px={"8.5px"}
                                _hover={{
                                  bg: "gray.subtle",
                                }}
                                rounded={themeConfig.radii.component}
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
                                              gap={3}
                                              px={2}
                                              rounded={`calc(${themeConfig.radii.component})`}
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
                                                  ml={"-6px"}
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
                                  px={2}
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
                              gap={4}
                              px={2}
                              justifyContent={"start"}
                              variant={"ghost"}
                              colorPalette={NAVS_COLOR_PALETTE}
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
                    </Fragment>
                  );
                })}
              </CContainer>
            );
          })}
        </CContainer>

        <CContainer mt={"auto"} gap={2} p={2}>
          <NavLink to={"/pvt/settings"}>
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
                {pathname.includes("/pvt/settings") && <LeftIndicator />}

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
                {pathname.includes("/pvt/profile") && <LeftIndicator />}

                <Avatar
                  src={user?.photoProfile?.fileUrl}
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
      <CContainer bg={BG_CONTENT_CONTAINER} overflowY={"auto"} color={"ibody"}>
        {/* Content header */}
        <HStack gap={4} h={"52px"} p={4} justify={"space-between"}>
          <HStack>
            {backPath && (
              <BackButton iconButton clicky={false} backPath={backPath} />
            )}

            {resolvedActiveNavs.map((nav, idx) => {
              return (
                <HStack key={idx}>
                  {idx !== 0 && (
                    <>
                      {backPath && (
                        <Icon boxSize={5} color={"fg.subtle"}>
                          <IconSlash stroke={1.5} />
                        </Icon>
                      )}

                      {!backPath && <DotIndicator color={"d4"} />}
                    </>
                  )}

                  <P
                    fontSize={16}
                    fontWeight={"semibold"}
                    ml={idx === 0 ? 1 : 0}
                    lineClamp={1}
                  >
                    {pluckString(l, nav.labelKey)}
                  </P>
                </HStack>
              );
            })}
          </HStack>

          <HStack flexShrink={0} gap={1}>
            <HStack mx={1}>
              <Clock />

              <Today />
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

interface Props extends StackProps {
  children: React.ReactNode;
}
const AppLayout = (props: Props) => {
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

export default AppLayout;
