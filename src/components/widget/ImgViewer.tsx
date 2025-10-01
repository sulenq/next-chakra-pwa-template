"use client";

import { CContainer } from "@/components/ui/c-container";
import { CloseButton } from "@/components/ui/close-button";
import {
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
} from "@/components/ui/dialog";
import useBackOnClose from "@/hooks/useBackOnClose";
import { back } from "@/utils/client";
import { Image, StackProps, useDisclosure } from "@chakra-ui/react";

interface Props extends StackProps {
  src: string;
}

export const ImgViewer = (props: Props) => {
  // Props
  const { children, src, ...restProps } = props;

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(`img-viewer-${src}`, open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} cursor={"pointer"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DialogRoot open={open} size={"cover"}>
        <DialogContent bg={"transparent"} onClick={back}>
          <DialogHeader>
            <CloseButton
              colorPalette={"light"}
              rounded={"full"}
              pos={"absolute"}
              top={2}
              right={2}
              onClick={(e) => {
                e.stopPropagation();
                back();
              }}
            />
          </DialogHeader>

          <DialogBody>
            <CContainer
              flex={1}
              h={"full"}
              justify={"center"}
              // border={"2px solid red"}
            >
              <Image
                src={src}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
            </CContainer>
          </DialogBody>

          <DialogFooter></DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
