"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
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
      checked,
      icon,
      children,
      inputProps,
      rootRef,
      subtle,
      bg,
      rounded,
      ...restProps
    } = props;

    // Stores
    const { theme } = useThemeStore();

    // Constants
    const graySolidBg = useColorModeValue("dark", "light");

    // Derived Values
    const isColorPaletteGray = theme.colorPalette === "gray";

    return (
      <ChakraCheckbox.Root
        ref={rootRef}
        checked={checked}
        cursor={"pointer"}
        colorPalette={theme.colorPalette}
        {...restProps}
      >
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />

        <ChakraCheckbox.Control
          bg={
            checked
              ? isColorPaletteGray
                ? graySolidBg
                : `${theme.colorPalette}.solid`
              : (bg ?? (subtle ? "bg.muted" : "transparent"))
          }
          rounded={rounded || `calc(${theme.radii.component}/2)`}
          borderColor={
            checked
              ? "transparent !important"
              : restProps.borderColor || (subtle ? "border.muted" : "d3")
          }
          cursor={"pointer"}
        >
          {checked && (
            <Icon boxSize={4} color={`${theme.colorPalette}.contrast`}>
              {icon || <CheckIcon />}
            </Icon>
          )}
        </ChakraCheckbox.Control>

        {children != null && (
          <ChakraCheckbox.Label w={"full"}>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  },
);
