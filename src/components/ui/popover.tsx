"use client";

import {
  Popover as ChakraPopover,
  PopoverRootProps,
  Portal,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { CloseButton } from "@/components/ui/close-button";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useColorBody } from "@/hooks/useColorBody";

interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
}

export const PopoverRoot = (props: PopoverRootProps) => {
  const { children, ...restProps } = props;

  return (
    <ChakraPopover.Root autoFocus={false} {...restProps}>
      {children}
    </ChakraPopover.Root>
  );
};

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  function PopoverContent(props, ref) {
    // Contexts
    const { themeConfig } = useThemeConfig();
    const { portalled = true, portalRef, ...restProps } = props;

    return (
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraPopover.Positioner>
          <ChakraPopover.Content
            ref={ref}
            p={0}
            bg={"bg.body"}
            border={"1px solid"}
            borderColor={"border.subtle"}
            rounded={`calc(${themeConfig.radii.component} - 4px)`}
            shadow={"soft"}
            {...restProps}
          />
        </ChakraPopover.Positioner>
      </Portal>
    );
  },
);

export const PopoverArrow = forwardRef<
  HTMLDivElement,
  ChakraPopover.ArrowProps
>(function PopoverArrow(props, ref) {
  // SX
  const BG = useColorBody();

  return (
    <ChakraPopover.Arrow ref={ref}>
      <ChakraPopover.ArrowTip
        bg={BG}
        // backdropFilter={"blur(5px)"}
        // bg={"darktrans !important"}
        // borderColor={"transparent"}
        {...props}
      />
    </ChakraPopover.Arrow>
  );
});

export const PopoverCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraPopover.CloseTriggerProps
>(function PopoverCloseTrigger(props, ref) {
  return (
    <ChakraPopover.CloseTrigger
      position="absolute"
      top="1"
      insetEnd="1"
      {...props}
      asChild
      ref={ref}
    >
      <CloseButton size="sm" />
    </ChakraPopover.CloseTrigger>
  );
});

export const PopoverTitle = ChakraPopover.Title;
export const PopoverDescription = ChakraPopover.Description;
export const PopoverFooter = ChakraPopover.Footer;
export const PopoverHeader = ChakraPopover.Header;
export const PopoverBody = ChakraPopover.Body;
export const PopoverTrigger = ChakraPopover.Trigger;

export const Popover = {
  Root: PopoverRoot,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  CloseTrigger: PopoverCloseTrigger,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Footer: PopoverFooter,
  Header: PopoverHeader,
  Body: PopoverBody,
  Trigger: PopoverTrigger,
};
