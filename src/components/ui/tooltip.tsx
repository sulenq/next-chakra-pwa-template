import { P } from "@/components/ui/p";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: ChakraTooltip.ContentProps;
  disabled?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    // Props
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...restProps
    } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    if (disabled) return children;

    return (
      <ChakraTooltip.Root
        openDelay={1000}
        positioning={{
          placement: "bottom-start",
        }}
        {...restProps}
      >
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content
              ref={ref}
              w={"fit"}
              maxW={"240px"}
              px={2}
              py={1}
              rounded={themeConfig.radii.component}
              bg={"body"}
              color={"ibody"}
              {...contentProps}
            >
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}

              <P fontSize={"sm"}>{content}</P>
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    );
  },
);
