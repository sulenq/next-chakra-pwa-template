"use client";

import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";
import { MAIN_BUTTON_SIZE } from "@/constants/sizes";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { forwardRef, useMemo } from "react";

export interface BtnProps extends ButtonProps {
  children?: React.ReactNode;
  clicky?: boolean;
  iconButton?: boolean;
  focusStyle?: boolean;
}

export const Btn = forwardRef<HTMLButtonElement, BtnProps>((props, ref) => {
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

  // States, Refs
  const resolvedClassName = `${clicky ? "clicky" : ""} ${className}`.trim();

  // Memoized Active Style
  const resolvedMutedColor = useColorModeValue(
    `${props.colorPalette}.200 !important`,
    `${props.colorPalette}.800 !important`
  );
  const activeBg = useMemo(() => {
    if (props.colorPalette) {
      switch (props?.variant) {
        default:
          return `${props.colorPalette}.solid`;
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
              boxShadow: "0 0 0 2px {colors.gray.500}",
            }
          : {}
      }
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
      size={size || (MAIN_BUTTON_SIZE as any)}
      rounded={themeConfig.radii.component}
      _hover={{ bg: activeBg }}
      _active={{ bg: activeBg }}
      _focusVisible={
        focusStyle
          ? {
              boxShadow: "0 0 0 2px {colors.gray.500}",
            }
          : {}
      }
      {...restProps}
    >
      {children}
    </Button>
  );
});

Btn.displayName = "Btn";
