"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, BoxProps, Icon, IconProps } from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";

export const LeftIndicator = (props: BoxProps) => {
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
      left={"-1.5px"}
      transform={"translateY(-50%)"}
      {...props}
    />
  );
};

export const BottomIndicator = (props: BoxProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Box
      w={"12px"}
      h={"3px"}
      bg={themeConfig.primaryColor}
      rounded={"full"}
      pos={"absolute"}
      bottom={-2}
      left={"50%"}
      transform={"translateX(-50%)"}
      {...props}
    />
  );
};

export const DotIndicator = (props: IconProps) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <Icon color={themeConfig.primaryColor} boxSize={2} {...restProps}>
      {children || <IconCircleFilled />}
    </Icon>
  );
};
