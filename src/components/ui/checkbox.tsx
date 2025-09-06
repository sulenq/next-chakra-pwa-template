"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { Checkbox as ChakraCheckbox } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(props, ref) {
    // Props
    const { icon, children, inputProps, rootRef, ...rest } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <ChakraCheckbox.Root
        ref={rootRef}
        cursor={"pointer"}
        colorPalette={themeConfig.colorPalette}
        {...rest}
      >
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
        <ChakraCheckbox.Control
          borderRadius={props?.borderRadius || "sm"}
          borderColor={rest.borderColor}
          bg={rest.bg}
        >
          {icon || <ChakraCheckbox.Indicator boxSize={4} />}
        </ChakraCheckbox.Control>
        {children != null && (
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  }
);
