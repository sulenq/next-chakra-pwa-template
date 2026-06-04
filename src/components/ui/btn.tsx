"use client";

import { MAIN_BUTTON_SIZE } from "@/constants/styles";
import { ButtonVariant } from "@/types/global.types";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface BtnProps extends Omit<ButtonProps, "variant"> {
  children?: React.ReactNode;
  clicky?: boolean;
  iconButton?: boolean;
  focusStyle?: boolean;
  variant?: ButtonVariant;
}

export const Btn = forwardRef<HTMLButtonElement, BtnProps>(
  function Btn(props, ref) {
    // Props
    const {
      children,
      className = "",
      clicky = true,
      iconButton = false,
      colorPalette = "gray",
      size,
      focusStyle = true,
      ...restProps
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Derived Values
    const isVariantOutline = props.variant === "outline";
    const isColorPaletteGray = colorPalette === "gray";
    const resolvedClassName = `${clicky ? "clicky" : ""} ${className}`.trim();

    return iconButton ? (
      <IconButton
        ref={ref}
        className={resolvedClassName}
        size={size || (MAIN_BUTTON_SIZE as any)}
        colorPalette={colorPalette}
        borderColor={
          restProps.borderColor || (isVariantOutline && isColorPaletteGray)
            ? "border.muted"
            : ""
        }
        rounded={theme.radii.component}
        fontSize={"md"}
        _focusVisible={
          focusStyle
            ? {
                outline: "2px solid {colors.gray.500}",
              }
            : {}
        }
        transition={"200ms"}
        {...restProps}
        variant={props.variant as any}
      >
        {children}
      </IconButton>
    ) : (
      <Button
        ref={ref}
        className={resolvedClassName}
        colorPalette={colorPalette}
        size={size || (MAIN_BUTTON_SIZE as any)}
        borderColor={
          restProps.borderColor || (isVariantOutline && isColorPaletteGray)
            ? "border.muted"
            : ""
        }
        fontSize={"md"}
        fontWeight={"normal"}
        rounded={theme.radii.component}
        _focusVisible={
          focusStyle
            ? {
                outline: "2px solid {colors.gray.500}",
              }
            : {}
        }
        transition={"200ms"}
        {...restProps}
        variant={props.variant as any}
      >
        {children}
      </Button>
    );
  },
);

// -----------------------------------------------------------------

export const PBtn = forwardRef<HTMLButtonElement, BtnProps>(
  function PBtn(props, ref) {
    // Stores
    const { theme } = useThemeStore();

    return <Btn ref={ref} colorPalette={theme.colorPalette} {...props} />;
  },
);
