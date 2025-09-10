"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import useIsSmScreenWidth from "@/hooks/useIsSmScreenWidth";
import { HStack, Stack, StackProps } from "@chakra-ui/react";

const MobileLayout = (props: any) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <CContainer>
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
  const { themeConfig } = useThemeConfig();

  return (
    <HStack align={"stretch"} minH={"100dvh"} gap={0} bg={"red"}>
      {/* Navs */}
      <CContainer w={"300px"}></CContainer>

      {/* Content */}
      <CContainer p={2}>
        <CContainer bg={"body"} flex={1} rounded={themeConfig.radii.container}>
          {children}
        </CContainer>
      </CContainer>
    </HStack>
  );
};

export const NavsContainer = (props: StackProps) => {
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
