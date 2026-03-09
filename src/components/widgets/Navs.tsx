import { Accordion } from "@/components/ui/accordion";
import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Menu } from "@/components/ui/menu";
import { NavLink, NavLinkProps } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widgets/app-icon";
import { ClampText } from "@/components/widgets/clamp-text";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { LeftIndicator } from "@/components/widgets/indicator";
import { MContainer } from "@/components/widgets/m-container";
import { Interface__NavGroup } from "@/constants/interfaces";
import {
  BASE_ICON_BOX_SIZE,
  DESKTOP_NAVS_COLOR,
  DESKTOP_NAVS_POPOVER_MAIN_AXIS,
  DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
  NAVS_COLOR_PALETTE,
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
  isNavsExpanded?: boolean;
  showSearch?: boolean;
  addonElement?: any;
}
export const DesktopNavs = (props: DesktopNavsProps) => {
  // Props
  const {
    navs,
    isNavsExpanded = false,
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
    })
    .filter(Boolean) as Interface__NavGroup[];

  useEffect(() => {
    if (!isNavsExpanded) {
      setSearch("");
    } else {
      searchInputRef.current?.focus();
    }
  }, [isNavsExpanded]);

  return (
    <CContainer {...restProps}>
      {/* Search */}
      {isNavsExpanded && showSearch && (
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
                              >
                                {isMainNavsActive && nav.icon && (
                                  <LeftIndicator />
                                )}

                                {nav.icon && (
                                  <AppIcon
                                    icon={nav.icon}
                                    color={isMainNavsActive ? "" : "fg.muted"}
                                  />
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
                                    nav.label
                                      ? nav.label
                                      : pluckString(t, nav.labelKey)
                                  }
                                >
                                  <CContainer>
                                    <Menu.Trigger asChild>
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
                                        {isMainNavsActive && <LeftIndicator />}
                                        <AppIcon icon={nav.icon} />
                                      </Btn>
                                    </Menu.Trigger>
                                  </CContainer>
                                </DesktopNavTooltip>

                                <Menu.Content>
                                  {nav.children?.map(
                                    (subGroup, menuItemIdx) => (
                                      <Menu.ItemGroup
                                        key={menuItemIdx}
                                        gap={1}
                                        title={
                                          subGroup.labelKey
                                            ? pluckString(t, subGroup.labelKey)
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
                                                <Menu.Item
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
                                                </Menu.Item>
                                              </Tooltip>
                                            </NavLink>
                                          );
                                        })}
                                      </Menu.ItemGroup>
                                    ),
                                  )}
                                </Menu.Content>
                              </Menu.Root>
                            )}

                            {isNavsExpanded && (
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
                                    <Btn
                                      as={Accordion.ItemTrigger}
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

                                  <Accordion.ItemContent p={0}>
                                    <CContainer gap={1} pt={1}>
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
                </CContainer>
              );
            })}
        </CContainer>

        {addonElement}
      </MContainer>
    </CContainer>
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
