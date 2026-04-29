"use client";

import { CloseButton } from "@/components/ui/close-button";
import { BACKDROP_BLUR_FILTER } from "@/shared/constants/styles";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import {
  Popover as ChakraPopover,
  PopoverRootProps,
  Portal,
} from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

const PopoverRoot = (props: PopoverRootProps) => {
  const { children, ...restProps } = props;

  return (
    <ChakraPopover.Root autoFocus={false} {...restProps}>
      {children}
    </ChakraPopover.Root>
  );
};

// -----------------------------------------------------------------

export interface PopoverContentProps extends ChakraPopover.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement | null>;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
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
            backdropFilter={BACKDROP_BLUR_FILTER}
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

// -----------------------------------------------------------------

const PopoverArrow = forwardRef<HTMLDivElement, ChakraPopover.ArrowProps>(
  function PopoverArrow(props, ref) {
    return (
      <ChakraPopover.Arrow ref={ref}>
        <ChakraPopover.ArrowTip
          bg={"bg.body"}
          // backdropFilter={"blur(5px)"}
          // bg={"darktrans !important"}
          // borderColor={"transparent"}
          {...props}
        />
      </ChakraPopover.Arrow>
    );
  },
);

const PopoverCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraPopover.CloseTriggerProps
>(function PopoverCloseTrigger(props, ref) {
  return (
    <ChakraPopover.CloseTrigger
      position={"absolute"}
      top={"1"}
      insetEnd={"1"}
      {...props}
      asChild
      ref={ref}
    >
      <CloseButton size={"sm"} />
    </ChakraPopover.CloseTrigger>
  );
});

// -----------------------------------------------------------------

const PopoverTitle = ChakraPopover.Title;

// -----------------------------------------------------------------

const PopoverDescription = ChakraPopover.Description;

// -----------------------------------------------------------------

const PopoverFooter = ChakraPopover.Footer;

// -----------------------------------------------------------------

const PopoverHeader = ChakraPopover.Header;

// -----------------------------------------------------------------

const PopoverBody = ChakraPopover.Body;

// -----------------------------------------------------------------

const PopoverTrigger = ChakraPopover.Trigger;

// -----------------------------------------------------------------

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
