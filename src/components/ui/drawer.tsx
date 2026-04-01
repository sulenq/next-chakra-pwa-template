"use client";

import { CloseButton } from "@/components/ui/close-button";
import { BACKDROP_BLUR_FILTER } from "@/constants/styles";
import { back } from "@/utils/client";
import {
  Drawer as ChakraDrawer,
  DrawerPositionerProps,
  Portal,
} from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

const DrawerRoot = (props: ChakraDrawer.RootProps) => {
  return <ChakraDrawer.Root onEscapeKeyDown={back} {...props} />;
};

// -----------------------------------------------------------------

export interface DrawerContentProps extends ChakraDrawer.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  offset?: ChakraDrawer.ContentProps["padding"];
  backdrop?: boolean;
  positionerProps?: DrawerPositionerProps;
}

const DrawerContent = forwardRef<HTMLDivElement, DrawerContentProps>(
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
            zIndex={"modal"}
            // backdropFilter={`blur(${BLUR_RADIUS})`}
          />
        )}
        <ChakraDrawer.Positioner
          zIndex={"modal"}
          padding={offset}
          pointerEvents={"auto"}
          onClick={() => {
            back();
          }}
          {...positionerProps}
        >
          <ChakraDrawer.Content
            ref={ref}
            bg={"bg.body"}
            backdropFilter={BACKDROP_BLUR_FILTER}
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

// -----------------------------------------------------------------

const DrawerCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraDrawer.CloseTriggerProps
>(function DrawerCloseTrigger(props, ref) {
  return (
    <ChakraDrawer.CloseTrigger
      position={"absolute"}
      top={"2"}
      insetEnd={"2"}
      {...props}
      asChild
    >
      <CloseButton size={"xs"} ref={ref} />
    </ChakraDrawer.CloseTrigger>
  );
});

export const Drawer = {
  Root: DrawerRoot,
  Content: DrawerContent,
  CloseTrigger: DrawerCloseTrigger,
  Trigger: ChakraDrawer.Trigger,
  Footer: ChakraDrawer.Footer,
  Header: ChakraDrawer.Header,
  Body: ChakraDrawer.Body,
  Backdrop: ChakraDrawer.Backdrop,
  Description: ChakraDrawer.Description,
  Title: ChakraDrawer.Title,
  ActionTrigger: ChakraDrawer.ActionTrigger,
};
