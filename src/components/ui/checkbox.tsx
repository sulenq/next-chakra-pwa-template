"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Checkbox as ChakraCheckbox, Icon } from "@chakra-ui/react";
import { XIcon } from "lucide-react";
import { forwardRef } from "react";

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
  subtle?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    // Props
    const {
      icon,
      children,
      inputProps,
      rootRef,
      checked,
      subtle,
      ...restProps
    } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    // States
    const isRoundedZero = themeConfig.radii.component === "0px";
    const isColorPaletteGray = themeConfig.colorPalette === "gray";
    const graySolidBg = useColorModeValue("dark", "light");

    return (
      <ChakraCheckbox.Root
        ref={rootRef}
        cursor={"pointer"}
        colorPalette={themeConfig.colorPalette}
        {...restProps}
      >
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />

        <ChakraCheckbox.Control
          bg={
            restProps.bg || checked
              ? isColorPaletteGray
                ? graySolidBg
                : themeConfig.primaryColor
              : subtle
                ? "bg.muted"
                : "transparent"
          }
          rounded={props?.rounded || isRoundedZero ? "0px" : "sm"}
          borderColor={
            restProps.borderColor ||
            (checked ? "transparent" : subtle ? "border.muted" : "d3")
          }
          cursor={"pointer"}
        >
          {checked && (
            <Icon boxSize={4} color={`${themeConfig.colorPalette}.contrast`}>
              {icon || <XIcon />}
            </Icon>
          )}
        </ChakraCheckbox.Control>

        {children != null && (
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  },
);
