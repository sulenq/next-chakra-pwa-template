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
import { DotIndicator } from "@/components/widget/DotIndicator";
import Logo from "@/components/widget/Logo";
import { MiniProfile } from "@/components/widget/MiniProfile";
import { APP } from "@/constants/_meta";
import { NAVS } from "@/constants/navs";
import useLang from "@/context/useLang";
import useNavs from "@/context/useNavs";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { getUserData } from "@/utils/auth";
import { pluckString } from "@/utils/string";
import { Box, Center, HStack, Icon, StackProps } from "@chakra-ui/react";
import {
  IconBoxAlignLeft,
  IconCircleFilled,
  IconSelector,
  IconSettings,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";

const NavTooltip = (props: TooltipProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Tooltip
      positioning={{
        placement: "right",
        offset: {
          mainAxis: 12,
        },
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};
const DesktopActiveIndicator = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Box
      w={"3px"}
      h={"12px"}
      bg={themeConfig.primaryColor}
      rounded={"full"}
      pos={"absolute"}
      top={"50%"}
      left={0}
      transform={"translateY(-50%)"}
    />
  );
};
const MobileLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <CContainer {...restProps}>
      {/* Content */}
      <CContainer bg={"bg.emphasized"}>{children}</CContainer>

      {/* Navs */}
      <HStack bg={"yellow"}></HStack>
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
  const router = useRouter();
  const pathname = usePathname();

  // States
  const user = getUserData();

  return (
    <HStack
      // border={"4px solid orange"}
      align={"stretch"}
      gap={0}
      h={"100dvh"}
      bg={"dark"}
      overflowY={"auto"}
      {...restProps}
    >
      {/* Navs */}
      <CContainer
        w={navsExpanded ? "300px" : "58px"}
        gap={8}
        p={2}
        transition={"200ms"}
      >
        <CContainer gap={1}>
          {!navsExpanded && (
            <Btn
              iconButton
              clicky={false}
              variant={"ghost"}
              colorPalette={"light"}
              w={"42px"}
              mr={"auto"}
            >
              <Logo size={15} />
            </Btn>
          )}

          <HStack justify={"space-between"}>
            {navsExpanded && (
              <NavLink to="/">
                <HStack ml={"10px"}>
                  <Logo size={15} />

                  <P
                    w={"full"}
                    fontSize={15}
                    fontWeight={"semibold"}
                    color={"light"}
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
                  mainAxis: 12,
                },
              }}
            >
              <Btn
                iconButton
                clicky={false}
                w={"42px"}
                variant={"ghost"}
                colorPalette={"light"}
                onClick={toggleNavsExpanded}
              >
                <Icon>
                  <IconBoxAlignLeft />
                </Icon>
              </Btn>
            </Tooltip>
          </HStack>
        </CContainer>

        <CContainer gap={1}>
          {NAVS.map((nav) => {
            const hasSubMenu = nav.subMenus;
            const isMainNavsActive = pathname.includes(nav.path);

            return (
              <Fragment key={nav.path}>
                {hasSubMenu && navsExpanded && (
                  <AccordionRoot multiple>
                    <AccordionItem
                      value={nav.path}
                      bg={{
                        _open: "d1",
                      }}
                      border={"none"}
                      rounded={themeConfig.radii.component}
                    >
                      <NavTooltip
                        key={nav.path}
                        content={pluckString(l, nav.labelKey)}
                      >
                        <AccordionItemTrigger
                          color={"light"}
                          h={"40px"}
                          px={"10.5px"}
                          _hover={{
                            bg: "d2",
                          }}
                          pos={"relative"}
                          cursor={"pointer"}
                          transition={"200ms"}
                        >
                          {isMainNavsActive && <DesktopActiveIndicator />}

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
                          {nav.subMenus.map((menu) => {
                            const isSubNavsActive = pathname === menu.path;

                            return (
                              <Btn
                                key={menu.path}
                                iconButton={navsExpanded ? false : true}
                                clicky={false}
                                w={"full"}
                                gap={4}
                                px={"6px"}
                                rounded={`calc(${themeConfig.radii.component} - 2px)`}
                                justifyContent={"start"}
                                variant={"ghost"}
                                colorPalette={"light"}
                                onClick={() => {
                                  router.push(menu.path);
                                }}
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
                                    <IconCircleFilled stroke={1.5} />
                                  </Icon>
                                </Center>

                                <P lineClamp={1} textAlign={"left"}>
                                  {pluckString(l, menu.labelKey)}
                                </P>
                              </Btn>
                            );
                          })}
                        </CContainer>
                      </AccordionItemContent>
                    </AccordionItem>
                  </AccordionRoot>
                )}

                {hasSubMenu && !navsExpanded && (
                  <MenuRoot
                    positioning={{
                      placement: "right-start",
                      offset: {
                        mainAxis: 12,
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
                            colorPalette={"light"}
                            pos={"relative"}
                          >
                            {isMainNavsActive && <DesktopActiveIndicator />}

                            <Icon boxSize={5}>
                              <nav.icon stroke={1.5} />
                            </Icon>
                          </Btn>
                        </MenuTrigger>
                      </CContainer>
                    </NavTooltip>

                    <MenuContent>
                      {nav.subMenus.map((menu) => {
                        const isSubNavsActive = pathname === menu.path;

                        return (
                          <MenuItem
                            key={menu.path}
                            value={menu.path}
                            onClick={() => {
                              router.push(menu.path);
                            }}
                          >
                            {pluckString(l, menu.labelKey)}

                            {isSubNavsActive && <DotIndicator />}
                          </MenuItem>
                        );
                      })}
                    </MenuContent>
                  </MenuRoot>
                )}

                {!hasSubMenu && (
                  <NavTooltip content={pluckString(l, nav.labelKey)}>
                    <Btn
                      iconButton={navsExpanded ? false : true}
                      clicky={false}
                      h={"40px"}
                      gap={4}
                      px={"10px"}
                      justifyContent={"start"}
                      variant={"ghost"}
                      colorPalette={"light"}
                      onClick={() => {
                        router.push(nav.path);
                      }}
                    >
                      {isMainNavsActive && <DesktopActiveIndicator />}

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
                )}
              </Fragment>
            );
          })}
        </CContainer>

        <CContainer mt={"auto"} gap={2}>
          <NavTooltip content={l.settings}>
            <Btn
              clicky={false}
              gap={4}
              justifyContent={"start"}
              variant={"ghost"}
              colorPalette={"light"}
              px={"10px"}
              onClick={() => {
                router.push("/settings");
              }}
            >
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

          <Divider />

          <PopoverRoot
            positioning={{ placement: "right-end", offset: { mainAxis: 12 } }}
          >
            <PopoverTrigger asChild>
              <HStack
                gap={4}
                px={navsExpanded ? "10px" : "9px"}
                py={2}
                rounded={themeConfig.radii.component}
                color={"light"}
                cursor={"pointer"}
                _hover={{
                  bg: "d2",
                }}
                transition={"200ms"}
              >
                <Avatar
                  src={user?.photoProfile?.file_url}
                  name={user?.name}
                  size={navsExpanded ? "xs" : "2xs"}
                />

                {navsExpanded && (
                  <>
                    <CContainer>
                      <P lineClamp={1} fontWeight={"semibold"}>
                        {user?.name}
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

            <PopoverContent w={"200px"}>
              <MiniProfile />
            </PopoverContent>
          </PopoverRoot>
        </CContainer>
      </CContainer>

      {/* Content */}
      <CContainer bg={"body"}>{children}</CContainer>
    </HStack>
  );
};

export const AppLayout = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer {...restProps}>
      {iss ? <MobileLayout {...props} /> : <DesktopLayout {...props} />}
    </CContainer>
  );
};
