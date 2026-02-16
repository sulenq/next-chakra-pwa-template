"use client";

import { back } from "@/utils/client";
import {
  Drawer as ChakraDrawer,
  DrawerPositionerProps,
  Portal,
} from "@chakra-ui/react";
import { forwardRef } from "react";
import { CloseButton } from "./close-button";
import { BLUR_RADIUS } from "@/constants/styles";

export interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  offset?: ChakraDrawer.ContentProps["padding"];
  backdrop?: boolean;
  positionerProps?: DrawerPositionerProps;
}

export const DrawerRoot = (props: ChakraDrawer.RootProps) => {
  return <ChakraDrawer.Root onEscapeKeyDown={back} {...props} />;
};

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(props, ref) {
    const {
      children,
      portalled = true,
      portalRef,
      offset,
      backdrop = true,
      positionerProps,
      ...rest
    } = props;

    return (
      <Portal disabled={!portalled} container={portalRef}>
        {backdrop && (
          <ChakraDrawer.Backdrop
            zIndex="modal"
            backdropFilter={`blur(${BLUR_RADIUS})`}
          />
        )}
        <ChakraDrawer.Positioner
          zIndex="modal"
          padding={offset}
          pointerEvents={"auto"}
          onClick={() => {
            back();
          }}
          {...positionerProps}
        >
          <ChakraDrawer.Content
            ref={ref}
            bg={"body"}
            justifyContent={"end"}
            shadow={"none"}
            onClick={(e) => e.stopPropagation()}
            asChild={false}
            {...rest}
          >
            {children}
          </ChakraDrawer.Content>
        </ChakraDrawer.Positioner>
      </Portal>
    );
  },
);

export const DrawerCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraDrawer.CloseTriggerProps
>(function DrawerCloseTrigger(props, ref) {
  return (
    <ChakraDrawer.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <CloseButton size="xs" ref={ref} />
    </ChakraDrawer.CloseTrigger>
  );
});

export const DrawerTrigger = ChakraDrawer.Trigger;
export const DrawerFooter = ChakraDrawer.Footer;
export const DrawerHeader = ChakraDrawer.Header;
export const DrawerBody = ChakraDrawer.Body;
export const DrawerBackdrop = ChakraDrawer.Backdrop;
export const DrawerDescription = ChakraDrawer.Description;
export const DrawerTitle = ChakraDrawer.Title;
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger;
