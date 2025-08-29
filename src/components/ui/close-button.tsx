import type { ButtonProps as ChakraCloseButtonProps } from "@chakra-ui/react";
import { IconButton as ChakraIconButton } from "@chakra-ui/react";
import { IconX } from "@tabler/icons-react";
import { forwardRef } from "react";

export interface CloseButtonProps extends ChakraCloseButtonProps {}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    return (
      <ChakraIconButton variant="ghost" aria-label="Close" ref={ref} {...props}>
        {props.children ?? <IconX />}
      </ChakraIconButton>
    );
  }
);
