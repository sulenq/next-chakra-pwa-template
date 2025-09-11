"use client";

import { CContainer } from "@/components/ui/c-container";
import { RouteContainer } from "@/components/widget/RouteContainer";
import { OTHER_NAVS } from "@/constants/navs";
import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, StackProps } from "@chakra-ui/react";

const SETTING_NAVS = OTHER_NAVS[0];

export const AppSettingsLayout = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <RouteContainer id={"settings_container"} {...restProps}>
      <HStack align={"stretch"} flex={1}>
        <CContainer
          w={"300px"}
          className="scrollY"
          border={"1px solid"}
          borderColor={"border.muted"}
          rounded={themeConfig.radii.container}
        ></CContainer>

        <CContainer></CContainer>
      </HStack>
    </RouteContainer>
  );
};
