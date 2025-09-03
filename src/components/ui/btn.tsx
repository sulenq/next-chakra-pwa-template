"use client";

import { MAIN_BUTTON_SIZE } from "@/constants/sizes";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { useMemo, forwardRef } from "react";

export interface BtnProps extends ButtonProps {
  children?: React.ReactNode;
  clicky?: boolean;
  iconButton?: boolean;
}

export const Btn = forwardRef<HTMLButtonElement, BtnProps>((props, ref) => {
  // Props
  const {
    children,
    clicky = true,
    iconButton = false,
    className = "",
    size,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States, Refs
  const resolvedClassName = `${clicky ? "clicky" : ""} ${className}`.trim();

  // Memoized Active Style
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
          return `${props.colorPalette}.muted`;
        case "plain":
          return "";
      }
    } else {
      switch (props?.variant) {
        default:
          return "gray.subtle";
        case "subtle":
        case "surface":
          return "gray.muted";
        case "plain":
          return "";
      }
    }
  }, [props.variant, props.colorPalette]);

  return iconButton ? (
    <IconButton
      ref={ref}
      className={resolvedClassName}
      size={size}
      borderRadius={themeConfig.radii.component}
      {...restProps}
    >
      {children}
    </IconButton>
  ) : (
    <Button
      ref={ref}
      className={resolvedClassName}
      fontWeight="semibold"
      size={size || (MAIN_BUTTON_SIZE as any)}
      borderRadius={themeConfig.radii.component}
      _active={{ bg: activeBg }}
      {...restProps}
    >
      {children}
    </Button>
  );
});

Btn.displayName = "Btn";
