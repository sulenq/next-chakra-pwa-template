"use client";

import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { MAIN_BUTTON_SIZE } from "@/constants/styles";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { forwardRef, useMemo } from "react";

export interface Props__Btn extends ButtonProps {
  children?: React.ReactNode;
  clicky?: boolean;
  iconButton?: boolean;
  focusStyle?: boolean;
}

export const Btn = forwardRef<HTMLButtonElement, Props__Btn>((props, ref) => {
  // Props
  const {
    children,
    clicky = true,
    iconButton = false,
    className = "",
    size,
    focusStyle = true,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();
  const { colorMode } = useColorMode();
  const graySolidActiveBg = useColorModeValue("gray.600", "gray.300");

  // States
  const resolvedClassName = `${clicky ? "clicky" : ""} ${className}`.trim();
  const isSubtle = props?.variant === "subtle";
  const isColorPaletteGray = props?.colorPalette === "gray";

  // Memoized Active Style
  const resolvedMutedColor = useColorModeValue(
    `${props.colorPalette}.200 !important`,
    `${props.colorPalette}.800 !important`,
  );
  const activeBg = useMemo(() => {
    if (props.colorPalette) {
      switch (props?.variant) {
        default:
          return isColorPaletteGray
            ? graySolidActiveBg
            : `${props.colorPalette}.600`;
        case "ghost":
        case "outline":
          return `${props.colorPalette}.subtle`;
        case "subtle":
        case "surface":
          return resolvedMutedColor;
        case "plain":
          return "";
      }
    } else {
      switch (props?.variant) {
        default:
          return "";
        case "subtle":
        case "surface":
          return "gray.muted";
      }
    }
  }, [props.variant, props.colorPalette, colorMode]);

  return iconButton ? (
    <IconButton
      ref={ref}
      fontSize={"md"}
      className={resolvedClassName}
      size={size || (MAIN_BUTTON_SIZE as any)}
      rounded={themeConfig.radii.component}
      _hover={{ bg: activeBg }}
      _active={{ bg: activeBg }}
      _focusVisible={
        focusStyle
          ? {
              outline: "2px solid {colors.gray.500}",
            }
          : {}
      }
      transition={"200ms"}
      {...restProps}
    >
      {children}
    </IconButton>
  ) : (
    <Button
      ref={ref}
      className={resolvedClassName}
      fontSize={"md"}
      fontWeight="medium"
      // bg={isSubtle && !props.colorPalette ? "d0" : ""}
      size={size || (MAIN_BUTTON_SIZE as any)}
      rounded={themeConfig.radii.component}
      _hover={{ bg: isSubtle && !props.colorPalette ? "d1" : activeBg }}
      _active={{ bg: activeBg }}
      _focusVisible={
        focusStyle
          ? {
              outline: "2px solid {colors.gray.500}",
            }
          : {}
      }
      transition={"200ms"}
      {...restProps}
    >
      {children}
    </Button>
  );
});

Btn.displayName = "Btn";
