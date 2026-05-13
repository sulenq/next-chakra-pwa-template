"use client";

import { useThemeContext } from "@/contexts/use-theme-context";
import { Circle, CircleProps } from "@chakra-ui/react";

interface RadioItemProps extends CircleProps {
  checked?: boolean;
}

export const RadioItem = (props: RadioItemProps) => {
  // Props
  const { checked = false, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeContext();

  return (
    <Circle
      w={"16px"}
      h={"16px"}
      bg={checked ? `${themeContext.colorPalette}.muted` : ""}
      border={checked ? "4px solid" : "2px solid"}
      borderColor={
        checked ? `${themeContext.colorPalette}.solid` : "border.muted"
      }
      cursor={"pointer"}
      {...restProps}
    />
  );
};
