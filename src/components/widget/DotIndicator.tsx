"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon, IconProps } from "@chakra-ui/react";
import { IconCircleFilled } from "@tabler/icons-react";

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
