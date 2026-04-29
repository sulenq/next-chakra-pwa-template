"use client";

import { MAIN_BUTTON_SIZE } from "@/shared/constants/styles";
import { ButtonVariant } from "@/shared/constants/types";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { Button, ButtonProps, IconButton } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface BtnProps extends ButtonProps {
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

    // Contexts
    const { themeConfig } = useThemeConfig();

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
        rounded={themeConfig.radii.component}
        fontSize={"md"}
        _focusVisible={
          focusStyle
            ? {
                outline: "2px solid {colors.gray.500}",
              }
            : {}
        }
        transition={"background-color 200ms"}
        {...restProps}
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
        fontWeight={"medium"}
        rounded={themeConfig.radii.component}
        _focusVisible={
          focusStyle
            ? {
                outline: "2px solid {colors.gray.500}",
              }
            : {}
        }
        transition={"background-color 200ms"}
        {...restProps}
      >
        {children}
      </Button>
    );
  },
);

// -----------------------------------------------------------------

export const PBtn = forwardRef<HTMLButtonElement, BtnProps>(
  function PBtn(props, ref) {
    // Contexts
    const { themeConfig } = useThemeConfig();

    return <Btn ref={ref} colorPalette={themeConfig.colorPalette} {...props} />;
  },
);
