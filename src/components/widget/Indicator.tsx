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
      left={0}
      transform={"translateY(-50%)"}
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
    <Icon
      color={themeConfig.primaryColor}
      boxSize={2}
      ml={"auto"}
      {...restProps}
    >
      {children || <IconCircleFilled />}
    </Icon>
  );
};
