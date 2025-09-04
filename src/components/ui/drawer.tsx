"use client";

import { back } from "@/utils/client";
import { Drawer as ChakraDrawer } from "@chakra-ui/react";
import { forwardRef } from "react";
import { CloseButton } from "./close-button";

interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  offset?: ChakraDrawer.ContentProps["padding"];
  backdrop?: boolean;
}

export const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
  function DrawerContent(props, ref) {
    const {
      children,
      offset,
      backdrop = true,
      // portalled = true,
      // portalRef,
      ...rest
    } = props;

    return (
      <>
        {backdrop && <ChakraDrawer.Backdrop />}
        <ChakraDrawer.Positioner
          padding={offset}
          pointerEvents={"auto"}
          onClick={() => {
            back();
          }}
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
      </>
    );
  }
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
export const DrawerRoot = ChakraDrawer.Root;
export const DrawerFooter = ChakraDrawer.Footer;
export const DrawerHeader = ChakraDrawer.Header;
export const DrawerBody = ChakraDrawer.Body;
export const DrawerBackdrop = ChakraDrawer.Backdrop;
export const DrawerDescription = ChakraDrawer.Description;
export const DrawerTitle = ChakraDrawer.Title;
export const DrawerActionTrigger = ChakraDrawer.ActionTrigger;
