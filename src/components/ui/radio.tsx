"use client";

import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { Circle, CircleProps } from "@chakra-ui/react";

interface RadioItemProps extends CircleProps {
  checked?: boolean;
}

export const RadioItem = (props: RadioItemProps) => {
  // Props
  const { checked = false, ...restProps } = props;

  // Contexts
  const { theme } = useThemeStore();

  return (
    <Circle
      w={"16px"}
      h={"16px"}
      bg={checked ? `${theme.colorPalette}.muted` : ""}
      border={checked ? "4px solid" : "2px solid"}
      borderColor={checked ? `${theme.colorPalette}.solid` : "border.muted"}
      cursor={"pointer"}
      {...restProps}
    />
  );
};
