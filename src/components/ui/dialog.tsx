"use client";

import useScreen from "@/hooks/useScreen";
import { back } from "@/utils/client";
import {
  Dialog as ChakraDialog,
  DialogPositionerProps,
  Portal,
} from "@chakra-ui/react";
import { forwardRef, useRef, useState } from "react";
import { CloseButton } from "./close-button";
import { BLUR_RADIUS } from "@/constants/styles";

export interface DialogContentProps extends ChakraDialog.ContentProps {
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  backdrop?: boolean;
  positionerProps?: DialogPositionerProps;
}

export const DialogRoot = (props: ChakraDialog.RootProps) => {
  return <ChakraDialog.Root onEscapeKeyDown={back} {...props} />;
};

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  function DialogContent(props, ref) {
    // Props
    const {
      children,
      portalled = true,
      portalRef,
      backdrop = true,
      positionerProps,
      ...rest
    } = props;

    const [isMouseDownInsideContent, setIsMouseDownInsideContent] =
      useState(false);

    // Refs
    const contentRef = useRef<HTMLDivElement>(null);

    // Utils
    const { sh } = useScreen();

    return (
      <Portal disabled={!portalled} container={portalRef}>
        {backdrop && (
          <ChakraDialog.Backdrop backdropFilter={`blur(${BLUR_RADIUS})`} />
        )}
        <ChakraDialog.Positioner
          pointerEvents="auto"
          p={4}
          onMouseDown={(e) => {
            if (contentRef.current?.contains(e.target as Node)) {
              setIsMouseDownInsideContent(true);
            } else {
              setIsMouseDownInsideContent(false);
            }
          }}
          onMouseUp={(e) => {
            if (!isMouseDownInsideContent && e.currentTarget === e.target) {
              back();
            }
            setIsMouseDownInsideContent(false);
          }}
          {...positionerProps}
        >
          <ChakraDialog.Content
            ref={(node) => {
              contentRef.current = node;
              if (typeof ref === "function") ref(node);
              else if (ref) ref.current = node;
            }}
            minH={sh < 500 ? "90dvh" : ""}
            maxH={"full"}
            bg="body"
            shadow="none"
            onClick={(e) => {
              e.stopPropagation();
            }}
            {...rest}
          >
            {children}
          </ChakraDialog.Content>
        </ChakraDialog.Positioner>
      </Portal>
    );
  },
);

export const DialogCloseTrigger = forwardRef<
  HTMLButtonElement,
  ChakraDialog.CloseTriggerProps
>(function DialogCloseTrigger(props, ref) {
  return (
    <ChakraDialog.CloseTrigger
      position="absolute"
      top="2"
      insetEnd="2"
      {...props}
      asChild
    >
      <CloseButton size="2xs" ref={ref}>
        {props.children}
      </CloseButton>
    </ChakraDialog.CloseTrigger>
  );
});

export const DialogFooter = ChakraDialog.Footer;
export const DialogHeader = ChakraDialog.Header;
export const DialogBody = ChakraDialog.Body;
export const DialogBackdrop = ChakraDialog.Backdrop;
export const DialogTitle = ChakraDialog.Title;
export const DialogDescription = ChakraDialog.Description;
export const DialogTrigger = ChakraDialog.Trigger;
export const DialogActionTrigger = ChakraDialog.ActionTrigger;
