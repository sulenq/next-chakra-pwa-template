"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CloseButton } from "@/components/ui/close-button";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { NavLink } from "@/components/ui/nav-link";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { Icon, Image, StackProps, useDisclosure } from "@chakra-ui/react";
import { IconArrowUpRight } from "@tabler/icons-react";

interface Props extends StackProps {
  src: string;
}

export const ImgViewer = (props: Props) => {
  // Props
  const { children, src, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(`img-viewer-${src}`), open, onOpen, onClose);

  return (
    <>
      <CContainer w={"fit"} cursor={"pointer"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DialogRoot open={open} size={"cover"}>
        <DialogContent bg={"transparent"} onClick={back}>
          <DialogBody>
            <CContainer flex={1} h={"full"} justify={"center"}>
              <CContainer gap={4}>
                <CloseButton
                  colorPalette={"light"}
                  w={"fit"}
                  ml={"auto"}
                  onClick={(e) => {
                    e.stopPropagation();
                    back();
                  }}
                />

                <Image
                  src={src}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />

                <NavLink to={src}>
                  <Btn
                    w={"fit"}
                    size={"md"}
                    variant={"ghost"}
                    colorPalette={"light"}
                    pr={3}
                    ml={"auto"}
                  >
                    {l.open}
                    <Icon>
                      <IconArrowUpRight stroke={1.5} />
                    </Icon>
                  </Btn>
                </NavLink>
              </CContainer>
            </CContainer>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
