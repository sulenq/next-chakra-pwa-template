"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import { useThemeContext } from "@/contexts/use-theme-context";
import { Checkbox as ChakraCheckbox, Icon } from "@chakra-ui/react";
import { CheckIcon } from "lucide-react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

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
      bg,
      rounded,
      ...restProps
    } = props;

    // Contexts
    const { themeContext } = useThemeContext();

    // Constants
    const graySolidBg = useColorModeValue("dark", "light");

    // Derived Values
    const isColorPaletteGray = themeContext.colorPalette === "gray";

    return (
      <ChakraCheckbox.Root
        ref={rootRef}
        cursor={"pointer"}
        colorPalette={themeContext.colorPalette}
        {...restProps}
      >
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />

        <ChakraCheckbox.Control
          bg={
            checked
              ? isColorPaletteGray
                ? graySolidBg
                : `${themeContext.colorPalette}.solid`
              : (bg ?? (subtle ? "bg.muted" : "transparent"))
          }
          rounded={rounded || `calc(${themeContext.radii.component}/2)`}
          borderColor={
            checked
              ? "transparent !important"
              : restProps.borderColor || (subtle ? "border.muted" : "d3")
          }
          cursor={"pointer"}
        >
          {checked && (
            <Icon boxSize={4} color={`${themeContext.colorPalette}.contrast`}>
              {icon || <CheckIcon />}
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
