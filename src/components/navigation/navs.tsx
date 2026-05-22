"use client";

import { AppIconLucide } from "@/components/branding/app-icon";
import FeedbackNotFound from "@/components/feedback/feedback-not-found";
import { Accordion } from "@/components/ui/accordion";
import { Btn } from "@/components/ui/btn";
import { ClampText } from "@/components/ui/clamp-text";
import { LeftIndicator } from "@/components/ui/indicator";
import { Menu } from "@/components/ui/menu";
import { NavLink, NavLinkProps } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import {
  BASE_ICON_BOX_SIZE,
  COMMON_NAV_COLOR,
  DESKTOP_ACTIVE_NAV_BTN_VARIANT,
  DESKTOP_NAV_BTN_COLOR_PATELLE,
  DESKTOP_NAV_BTN_ICON_BG,
  DESKTOP_NAV_BTN_PX,
  DESKTOP_NAV_BTN_SIZE,
  DESKTOP_NAV_BTN_VARIANT,
  DESKTOP_NAV_GAP,
} from "@/constants/styles";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { NavGroup } from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { Box, Center, HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

// -----------------------------------------------------------------

export const DesktopNavTooltip = (props: TooltipProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Tooltip
      positioning={{
        placement: "right",
        offset: {
          mainAxis: 16,
        },
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

// -----------------------------------------------------------------

interface VNavsProps extends StackProps {
  navs: NavGroup[];
  navsExpanded?: boolean;
  addonBottomElement?: any;
  showGroupLabel?: boolean;
}

export const VNavs = (props: VNavsProps) => {
  // Props
  const {
    navs,
    navsExpanded = false,
    addonBottomElement,
    showGroupLabel = false,
    ...restProps
  } = props;

  // Store
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const pathname = usePathname();

  // Derived Values
  const resolvedNavs = navs;

  return (
    <StackV overflowX={"clip"} {...restProps}>
      {/* Navs List */}
      <StackV flex={1} gap={4}>
        {/* Private Navs */}
        {isEmptyArray(resolvedNavs) && <FeedbackNotFound />}

        {!isEmptyArray(resolvedNavs) &&
          resolvedNavs.map((navItem, navItemIdx) => {
            return (
              <StackV
                key={navItemIdx}
                align={navsExpanded ? "start" : "center"}
                gap={DESKTOP_NAV_GAP}
              >
                {showGroupLabel && navItem.labelKey && (
                  <ClampText
                    fontSize={"xs"}
                    fontWeight={"semibold"}
                    letterSpacing={"wide"}
                    color={"fg.subtle"}
                    visibility={navsExpanded ? "visible" : "hidden"}
                    ml={1}
                  >
                    {navItem.label?.toUpperCase() ||
                      pluckString(t, navItem.labelKey).toUpperCase()}
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
                            content={nav.label || pluckString(t, nav.labelKey)}
                          >
                            <Btn
                              iconButton={navsExpanded ? false : true}
                              clicky={false}
                              justifyContent={navsExpanded ? "start" : "start"}
                              gap={4}
                              px={DESKTOP_NAV_BTN_PX}
                              size={DESKTOP_NAV_BTN_SIZE}
                              variant={
                                isMainNavsActive
                                  ? DESKTOP_ACTIVE_NAV_BTN_VARIANT
                                  : DESKTOP_NAV_BTN_VARIANT
                              }
                              colorPalette={
                                isMainNavsActive
                                  ? theme.colorPalette
                                  : DESKTOP_NAV_BTN_COLOR_PATELLE
                              }
                            >
                              {/* {isMainNavsActive && nav.icon && (
                                  <LeftIndicator />
                                )} */}

                              {nav.icon && (
                                <Center
                                  p={2}
                                  bg={
                                    isMainNavsActive
                                      ? ""
                                      : DESKTOP_NAV_BTN_ICON_BG
                                  }
                                  rounded={theme.radii.component}
                                >
                                  <AppIconLucide
                                    icon={nav.icon}
                                    color={
                                      isMainNavsActive ? "" : COMMON_NAV_COLOR
                                    }
                                  />
                                </Center>
                              )}

                              {!nav.icon && (
                                <Icon
                                  boxSize={2}
                                  color={
                                    isMainNavsActive
                                      ? theme.primaryColor
                                      : "bg.emphasized"
                                  }
                                >
                                  <IconCircleFilled />
                                </Icon>
                              )}

                              {navsExpanded && (
                                <P lineClamp={1} textAlign={"left"}>
                                  {nav.label || pluckString(t, nav.labelKey)}
                                </P>
                              )}
                            </Btn>
                          </DesktopNavTooltip>
                        </NavLink>
                      )}

                      {hasSubMenus && (
                        <>
                          {!navsExpanded && (
                            <Menu.Root
                              positioning={{
                                placement: "right-start",
                                offset: {
                                  mainAxis: 16,
                                },
                              }}
                            >
                              <DesktopNavTooltip
                                content={
                                  nav.label || pluckString(t, nav.labelKey)
                                }
                              >
                                <StackV w={"full"}>
                                  <Menu.Trigger asChild>
                                    <Btn
                                      iconButton
                                      clicky={false}
                                      justifyContent={"start"}
                                      px={DESKTOP_NAV_BTN_PX}
                                      pr={navsExpanded ? DESKTOP_NAV_BTN_PX : 0}
                                      size={DESKTOP_NAV_BTN_SIZE}
                                      variant={
                                        isMainNavsActive
                                          ? DESKTOP_ACTIVE_NAV_BTN_VARIANT
                                          : DESKTOP_NAV_BTN_VARIANT
                                      }
                                      colorPalette={
                                        isMainNavsActive
                                          ? theme.colorPalette
                                          : DESKTOP_NAV_BTN_COLOR_PATELLE
                                      }
                                      pos={"relative"}
                                    >
                                      {/* {isMainNavsActive && <LeftIndicator />} */}

                                      <Center
                                        p={2}
                                        bg={
                                          isMainNavsActive
                                            ? ""
                                            : DESKTOP_NAV_BTN_ICON_BG
                                        }
                                        rounded={theme.radii.component}
                                      >
                                        <AppIconLucide
                                          icon={nav.icon}
                                          color={
                                            isMainNavsActive
                                              ? ""
                                              : COMMON_NAV_COLOR
                                          }
                                        />
                                      </Center>
                                    </Btn>
                                  </Menu.Trigger>
                                </StackV>
                              </DesktopNavTooltip>

                              <Menu.Content>
                                {nav.children?.map((subGroup, menuItemIdx) => (
                                  <Menu.ItemGroup
                                    key={menuItemIdx}
                                    gap={1}
                                    title={
                                      subGroup.labelKey
                                        ? pluckString(
                                            t,
                                            subGroup.labelKey,
                                          ).toUpperCase()
                                        : ""
                                    }
                                  >
                                    <StackV gap={1}>
                                      {subGroup.navs.map((menu) => {
                                        const isSubNavsActive =
                                          pathname === menu.path;

                                        return (
                                          <NavLink
                                            key={menu.path}
                                            to={menu.path}
                                            w={"full"}
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
                                              <Menu.Item
                                                value={menu.path}
                                                asChild
                                              >
                                                <Btn
                                                  clicky={false}
                                                  variant={"ghost"}
                                                  color={
                                                    isSubNavsActive
                                                      ? `${theme.colorPalette}.fg`
                                                      : COMMON_NAV_COLOR
                                                  }
                                                  px={3}
                                                  justifyContent={"start"}
                                                >
                                                  {isSubNavsActive && (
                                                    <LeftIndicator />
                                                  )}

                                                  <P lineClamp={1}>
                                                    {menu.label ||
                                                      pluckString(
                                                        t,
                                                        menu.labelKey,
                                                      )}
                                                  </P>
                                                </Btn>
                                              </Menu.Item>
                                            </Tooltip>
                                          </NavLink>
                                        );
                                      })}
                                    </StackV>
                                  </Menu.ItemGroup>
                                ))}
                              </Menu.Content>
                            </Menu.Root>
                          )}

                          {navsExpanded && (
                            <Accordion.Root multiple>
                              <Accordion.Item
                                value={nav.path}
                                border={"none"}
                                rounded={theme.radii.component}
                                _open={{ bg: "transparent" }}
                              >
                                <DesktopNavTooltip
                                  content={pluckString(t, nav.labelKey)}
                                >
                                  <Accordion.ItemTrigger
                                    indicatorPlacement={"none"}
                                    as={HStack}
                                    p={0}
                                  >
                                    <Btn
                                      clicky={false}
                                      justifyContent={"start"}
                                      px={DESKTOP_NAV_BTN_PX}
                                      size={DESKTOP_NAV_BTN_SIZE}
                                      variant={
                                        isMainNavsActive
                                          ? DESKTOP_ACTIVE_NAV_BTN_VARIANT
                                          : DESKTOP_NAV_BTN_VARIANT
                                      }
                                      colorPalette={
                                        isMainNavsActive
                                          ? theme.colorPalette
                                          : DESKTOP_NAV_BTN_COLOR_PATELLE
                                      }
                                      w={"full"}
                                      pos={"relative"}
                                    >
                                      {/* {isMainNavsActive && <LeftIndicator />} */}

                                      <StackH align={"center"} gap={4}>
                                        <Center
                                          p={2}
                                          bg={
                                            isMainNavsActive
                                              ? ""
                                              : DESKTOP_NAV_BTN_ICON_BG
                                          }
                                          rounded={theme.radii.component}
                                        >
                                          <AppIconLucide
                                            icon={nav.icon}
                                            color={
                                              isMainNavsActive
                                                ? ""
                                                : COMMON_NAV_COLOR
                                            }
                                          />
                                        </Center>

                                        <P lineClamp={1} textAlign={"left"}>
                                          {nav.label
                                            ? nav.label
                                            : pluckString(t, nav.labelKey)}
                                        </P>
                                      </StackH>

                                      <Accordion.ItemIndicator
                                        color={
                                          isMainNavsActive
                                            ? `${theme.colorPalette}.solid`
                                            : ""
                                        }
                                        ml={"auto"}
                                      />
                                    </Btn>
                                  </Accordion.ItemTrigger>
                                </DesktopNavTooltip>

                                <Accordion.ItemContent p={0}>
                                  <StackV gap={1} pt={DESKTOP_NAV_GAP}>
                                    {nav.children?.map(
                                      (subGroup, menuItemIdx) => (
                                        <StackV key={menuItemIdx} gap={1}>
                                          {subGroup.labelKey && (
                                            <ClampText
                                              fontSize={"sm"}
                                              fontWeight={"semibold"}
                                              color={"fg.subtle"}
                                              ml={9}
                                              mt={1}
                                            >
                                              {pluckString(
                                                t,
                                                subGroup.labelKey,
                                              )}
                                            </ClampText>
                                          )}

                                          {subGroup.navs.map((menu, index) => {
                                            const isFirstIdx = index === 0;
                                            const isLastIdx =
                                              index ===
                                              subGroup.navs.length - 1;
                                            const isSubNavsActive =
                                              pathname === menu.path;

                                            return (
                                              <NavLink
                                                key={menu.path}
                                                to={menu.path}
                                                w={"full"}
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
                                                      mainAxis: 16 + 2,
                                                    },
                                                  }}
                                                >
                                                  <StackH
                                                    align={"center"}
                                                    pos={"relative"}
                                                    pl={"8.5px"}
                                                    gap={1}
                                                  >
                                                    {!isFirstIdx && (
                                                      <Box
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
                                                        w={"1px"}
                                                        h={"calc(50% + 2px)"}
                                                        pos={"absolute"}
                                                        bottom={"-2px"}
                                                        left={"18px"}
                                                        bg={"d3"}
                                                      />
                                                    )}

                                                    <Center
                                                      boxSize={
                                                        BASE_ICON_BOX_SIZE
                                                      }
                                                      zIndex={2}
                                                      ml={"1.5px"}
                                                    >
                                                      <Icon
                                                        boxSize={2}
                                                        color={
                                                          isSubNavsActive
                                                            ? `${theme.colorPalette}.fg`
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
                                                      justifyContent={"start"}
                                                      gap={3}
                                                      px={3}
                                                      size={
                                                        DESKTOP_NAV_BTN_SIZE
                                                      }
                                                      variant={"ghost"}
                                                      rounded={`calc(${theme.radii.component})`}
                                                      color={
                                                        isSubNavsActive
                                                          ? `${theme.colorPalette}.fg`
                                                          : COMMON_NAV_COLOR
                                                      }
                                                    >
                                                      <P
                                                        lineClamp={1}
                                                        textAlign={"left"}
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
                                                  </StackH>
                                                </Tooltip>
                                              </NavLink>
                                            );
                                          })}
                                        </StackV>
                                      ),
                                    )}
                                  </StackV>
                                </Accordion.ItemContent>
                              </Accordion.Item>
                            </Accordion.Root>
                          )}
                        </>
                      )}
                    </Fragment>
                  );
                })}
              </StackV>
            );
          })}

        {addonBottomElement}
      </StackV>
    </StackV>
  );
};

// -----------------------------------------------------------------

export const MobileNavLink = (props: NavLinkProps) => {
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
