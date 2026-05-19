"use client";

import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { Box, BoxProps, Circle, CircleProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const LeftIndicator = (props: BoxProps) => {
  // Contexts
  const { themeContext } = useThemeContext();

  return (
    <Box
      w={"3px"}
      h={"8px"}
      bg={`${themeContext.colorPalette}.solid`}
      rounded={"full"}
      pos={"absolute"}
      top={"50%"}
      left={"-1.5px"}
      transform={"translateY(-50%)"}
      {...props}
    />
  );
};

// -----------------------------------------------------------------

export const BottomIndicator = (props: BoxProps) => {
  // Contexts
  const { themeContext } = useThemeContext();

  return (
    <Box
      w={"12px"}
      h={"3px"}
      bg={`${themeContext.colorPalette}.solid`}
      rounded={"full"}
      pos={"absolute"}
      bottom={-2}
      left={"50%"}
      transform={"translateX(-50%)"}
      {...props}
    />
  );
};

// -----------------------------------------------------------------

export const DotIndicator = (props: CircleProps) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeContext();

  // SX
  const boxSize = "6px";

  return (
    <Circle
      w={boxSize}
      h={boxSize}
      bg={`${themeContext.colorPalette}.solid`}
      border={"1px solid"}
      borderColor={"bg.muted"}
      {...restProps}
    >
      {children}
    </Circle>
  );
};
