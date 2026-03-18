import { Accordion } from "@/components/ui/accordion";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Menu } from "@/components/ui/menu";
import { NavLink, NavLinkProps } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackV } from "@/components/ui/stack";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { ClampText } from "@/components/widgets/clamp-text";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { LeftIndicator } from "@/components/widgets/indicator";
import { MContainer } from "@/components/widgets/m-container";
import { Interface__NavGroup } from "@/constants/interfaces";
import {
  BASE_ICON_BOX_SIZE,
  DESKTOP_ACTIVE_NAV_BTN_VARIANT,
  DESKTOP_NAVS_COLOR,
  DESKTOP_NAVS_POPOVER_MAIN_AXIS,
  DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
  DESKTOP_NAV_BTN_PX,
  DESKTOP_NAV_BTN_SIZE,
  DESKTOP_NAV_BTN_VARIANT,
  DESKTOP_NAV_GAP,
  R_SPACING_MD,
} from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { isEmptyArray } from "@/utils/array";
import { getUserData } from "@/utils/auth";
import { pluckString } from "@/utils/string";
import { Box, Center, HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";

export const DesktopNavTooltip = (props: TooltipProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Tooltip
      positioning={{
        placement: "right",
        offset: {
          mainAxis: DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
        },
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

interface DesktopNavsProps extends StackProps {
  navs: Interface__NavGroup[];
  navsExpanded?: boolean;
  showSearch?: boolean;
  addonElement?: any;
}
export const DesktopNavs = (props: DesktopNavsProps) => {
  // Props
  const {
    navs,
    navsExpanded = false,
    showSearch = true,
    addonElement,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Hooks
  const pathname = usePathname();

  // States
  const [search, setSearch] = useState<string>("");

  // Constants
  const user = getUserData();
  const roleId = user?.role?.id;
  const userPermissions = user?.role?.permissions;

  // Derived Values
  const q = (search ?? "").toLowerCase();
  const isAllowed = (item: { allowedRoles?: string[] }, roleId?: string) =>
    !item.allowedRoles ||
    item.allowedRoles.length === 0 ||
    (roleId && item.allowedRoles.includes(roleId));
  const qNormalized = q?.toLowerCase().trim();
  const resolvedNavs = navs
    .map((nav) => {
      const filteredList = nav.navs
        .map((nav) => {
          const labelMain =
            nav.label?.toLowerCase() ??
            pluckString(t, nav.labelKey)?.toLowerCase() ??
            "";
          const allowedMain = isAllowed(nav, userPermissions);

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
    })
    .filter(Boolean) as Interface__NavGroup[];

  useEffect(() => {
    if (!navsExpanded) {
      setSearch("");
    } else {
      searchInputRef.current?.focus();
    }
  }, [navsExpanded]);

  return (
    <StackV overflowX={"clip"} {...restProps}>
      {/* Search */}
      {navsExpanded && showSearch && (
        <CContainer py={2}>
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
        className={"scrollY"}
        overflowX={"clip"}
        flex={1}
        gap={1}
        py={2}
        // pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
      >
        {/* Private Navs */}
        <StackV gap={R_SPACING_MD}>
          {isEmptyArray(resolvedNavs) && <FeedbackNotFound />}

          {!isEmptyArray(resolvedNavs) &&
            resolvedNavs.map((navItem, navItemIdx) => {
              return (
                <StackV
                  key={navItemIdx}
                  align={navsExpanded ? "start" : "center"}
                  gap={DESKTOP_NAV_GAP}
                >
                  {navItem.labelKey && (
                    <ClampText
                      fontSize={"xs"}
                      fontWeight={"semibold"}
                      letterSpacing={"wide"}
                      color={"fg.subtle"}
                    >
                      {pluckString(t, navItem.labelKey).toUpperCase()}
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
                                iconButton={navsExpanded ? false : true}
                                clicky={false}
                                justifyContent={
                                  navsExpanded ? "start" : "start"
                                }
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
                                    ? themeConfig.colorPalette
                                    : ""
                                }
                              >
                                {/* {isMainNavsActive && nav.icon && (
                                  <LeftIndicator />
                                )} */}

                                {nav.icon && (
                                  <Center
                                    p={2}
                                    bg={isMainNavsActive ? "" : "bg.muted"}
                                    rounded={themeConfig.radii.component}
                                  >
                                    <AppIconLucide
                                      icon={nav.icon}
                                      color={
                                        isMainNavsActive
                                          ? ""
                                          : DESKTOP_NAVS_COLOR
                                      }
                                    />
                                  </Center>
                                )}

                                {!nav.icon && (
                                  <Icon
                                    boxSize={2}
                                    color={
                                      isMainNavsActive
                                        ? themeConfig.primaryColor
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
                                    mainAxis: DESKTOP_NAVS_POPOVER_MAIN_AXIS,
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
                                        pr={
                                          navsExpanded ? DESKTOP_NAV_BTN_PX : 0
                                        }
                                        size={DESKTOP_NAV_BTN_SIZE}
                                        variant={
                                          isMainNavsActive
                                            ? DESKTOP_ACTIVE_NAV_BTN_VARIANT
                                            : DESKTOP_NAV_BTN_VARIANT
                                        }
                                        colorPalette={
                                          isMainNavsActive
                                            ? themeConfig.colorPalette
                                            : ""
                                        }
                                        pos="relative"
                                      >
                                        {/* {isMainNavsActive && <LeftIndicator />} */}

                                        <Center
                                          p={2}
                                          bg={
                                            isMainNavsActive ? "" : "bg.muted"
                                          }
                                          rounded={themeConfig.radii.component}
                                        >
                                          <AppIconLucide
                                            icon={nav.icon}
                                            color={
                                              isMainNavsActive
                                                ? ""
                                                : DESKTOP_NAVS_COLOR
                                            }
                                          />
                                        </Center>
                                      </Btn>
                                    </Menu.Trigger>
                                  </StackV>
                                </DesktopNavTooltip>

                                <Menu.Content>
                                  {nav.children?.map(
                                    (subGroup, menuItemIdx) => (
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
                                        <CContainer gap={1}>
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
                                                          ? `${themeConfig.colorPalette}.fg`
                                                          : DESKTOP_NAVS_COLOR
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
                                        </CContainer>
                                      </Menu.ItemGroup>
                                    ),
                                  )}
                                </Menu.Content>
                              </Menu.Root>
                            )}

                            {navsExpanded && (
                              <Accordion.Root
                                multiple
                                value={search ? [nav.path] : undefined}
                              >
                                <Accordion.Item
                                  value={nav.path}
                                  border="none"
                                  rounded={themeConfig.radii.component}
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
                                            ? themeConfig.colorPalette
                                            : ""
                                        }
                                        w={"full"}
                                        pos={"relative"}
                                      >
                                        {isMainNavsActive && <LeftIndicator />}

                                        <HStack gap={4}>
                                          <Center
                                            p={2}
                                            bg={
                                              isMainNavsActive ? "" : "bg.muted"
                                            }
                                            rounded={
                                              themeConfig.radii.component
                                            }
                                          >
                                            <AppIconLucide
                                              icon={nav.icon}
                                              color={
                                                isMainNavsActive
                                                  ? ""
                                                  : DESKTOP_NAVS_COLOR
                                              }
                                            />
                                          </Center>

                                          <P lineClamp={1} textAlign="left">
                                            {nav.label
                                              ? nav.label
                                              : pluckString(t, nav.labelKey)}
                                          </P>
                                        </HStack>

                                        <Accordion.ItemIndicator
                                          color={
                                            isMainNavsActive
                                              ? `${themeConfig.colorPalette}.contrast`
                                              : ""
                                          }
                                          ml={"auto"}
                                        />
                                      </Btn>
                                    </Accordion.ItemTrigger>
                                  </DesktopNavTooltip>

                                  <Accordion.ItemContent p={0}>
                                    <CContainer gap={1} pt={DESKTOP_NAV_GAP}>
                                      {nav.children?.map(
                                        (subGroup, menuItemIdx) => (
                                          <CContainer key={menuItemIdx} gap={1}>
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

                                            {subGroup.navs.map((menu, idx) => {
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
                                                      pos={"relative"}
                                                      pl={"8.5px"}
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
                                                              ? `${themeConfig.colorPalette}.fg`
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
                                                        rounded={`calc(${themeConfig.radii.component})`}
                                                        color={
                                                          isSubNavsActive
                                                            ? `${themeConfig.colorPalette}.fg`
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
                                            })}
                                          </CContainer>
                                        ),
                                      )}
                                    </CContainer>
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
        </StackV>

        {addonElement}
      </MContainer>
    </StackV>
  );
};

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
