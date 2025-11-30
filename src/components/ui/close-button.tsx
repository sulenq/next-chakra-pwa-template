import { LucideIcon } from "@/components/widget/Icon";
import type {
  ButtonProps as ChakraCloseButtonProps,
  IconProps,
} from "@chakra-ui/react";
import { IconButton as ChakraIconButton, Icon } from "@chakra-ui/react";
import { XIcon } from "lucide-react";
import { forwardRef } from "react";

export interface CloseButtonProps extends ChakraCloseButtonProps {
  iconProps?: IconProps;
}

export const CloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  function CloseButton(props, ref) {
    // Props
    const { iconProps, ...restProps } = props;

    return (
      <ChakraIconButton
        variant="ghost"
        aria-label="Close"
        ref={ref}
        {...restProps}
      >
        <Icon boxSize={"18px"} {...iconProps}>
          {props.children ?? <LucideIcon icon={XIcon} />}
        </Icon>
      </ChakraIconButton>
    );
  }
);
