import { P } from "@/components/ui/p";
import { BACKDROP_BLUR_FILTER } from "@/shared/constants/styles";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react";
import * as React from "react";

// -----------------------------------------------------------------

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: string;
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
      content = "",
      contentProps,
      portalRef,
      ...restProps
    } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    if (disabled) return children;

    return (
      <ChakraTooltip.Root openDelay={500} {...restProps}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content
              ref={ref}
              w={"fit"}
              maxW={"240px"}
              bg={"bg.body"}
              backdropFilter={BACKDROP_BLUR_FILTER}
              color={"fg.ibody"}
              px={2}
              py={1}
              rounded={themeConfig.radii.component}
              border={"1px solid"}
              borderColor={"border.subtle"}
              shadow={"soft"}
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
