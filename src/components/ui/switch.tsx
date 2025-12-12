import { Switch as ChakraSwitch } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface SwitchProps extends ChakraSwitch.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  rootRef?: React.Ref<HTMLLabelElement>;
  trackLabel?: { on: React.ReactNode; off: React.ReactNode };
  thumbLabel?: { on: React.ReactNode; off: React.ReactNode };
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  props,
  ref
) {
  const {
    checked,
    inputProps,
    children,
    rootRef,
    trackLabel,
    thumbLabel,
    ...restProps
  } = props;

  return (
    <ChakraSwitch.Root
      ref={rootRef}
      checked={checked}
      cursor={"pointer"}
      {...restProps}
    >
      <ChakraSwitch.HiddenInput ref={ref} {...inputProps} />
      <ChakraSwitch.Control>
        <ChakraSwitch.Thumb
          boxShadow={"none !important"}
          bg={checked ? `${restProps?.colorPalette}.contrast` : "body"}
        >
          {thumbLabel && (
            <ChakraSwitch.ThumbIndicator fallback={thumbLabel?.off}>
              {thumbLabel?.on}
            </ChakraSwitch.ThumbIndicator>
          )}
        </ChakraSwitch.Thumb>
        {trackLabel && (
          <ChakraSwitch.Indicator fallback={trackLabel.off}>
            {trackLabel.on}
          </ChakraSwitch.Indicator>
        )}
      </ChakraSwitch.Control>
      {children != null && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
    </ChakraSwitch.Root>
  );
});
