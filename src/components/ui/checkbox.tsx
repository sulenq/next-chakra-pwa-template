"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { Checkbox as ChakraCheckbox, Icon } from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";
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
    const { icon, children, inputProps, rootRef, checked, subtle, ...rest } =
      props;

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
          rounded={props?.rounded || "sm"}
          borderColor={
            rest.borderColor || checked
              ? "transparent"
              : subtle
              ? "border.muted"
              : "d3"
          }
          bg={
            rest.bg || checked
              ? themeConfig.primaryColor
              : subtle
              ? "bg.muted"
              : "transparent"
          }
        >
          {checked && <Icon boxSize={4}>{icon || <IconX />}</Icon>}
        </ChakraCheckbox.Control>

        {children != null && (
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    );
  }
);
