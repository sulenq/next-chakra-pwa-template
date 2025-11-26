"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CloseButton } from "@/components/ui/close-button";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { SVGS_PATH } from "@/constants/paths";
import useLang from "@/context/useLang";
import useBackOnClose from "@/hooks/useBackOnClose";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { Icon, StackProps, useDisclosure } from "@chakra-ui/react";
import { IconArrowUpRight } from "@tabler/icons-react";

interface Props extends StackProps {
  id?: string;
  src?: string;
  fallbackSrc?: string;
  disabled?: boolean;
}

export const ImgViewer = (props: Props) => {
  // Props
  const {
    children,
    id,
    src,
    fallbackSrc,
    disabled = false,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(disclosureId(id || `${src}`), open, onOpen, onClose);

  return (
    <>
      <CContainer
        w={"fit"}
        cursor={disabled ? "" : "pointer"}
        onClick={
          disabled
            ? () => {}
            : (e) => {
                e.stopPropagation();
                onOpen();
              }
        }
        {...restProps}
      >
        {children}
      </CContainer>

      <DialogRoot open={open} size={"cover"}>
        <DialogContent bg={"transparent"} onClick={back}>
          <DialogBody>
            <CContainer flex={1} h={"full"} justify={"center"}>
              <CContainer gap={4} align={"center"} m={"auto"}>
                <CloseButton
                  colorPalette={"light"}
                  w={"fit"}
                  onClick={(e) => {
                    e.stopPropagation();
                    back();
                  }}
                />

                <Img
                  src={src || fallbackSrc || `${SVGS_PATH}/no-img.svg`}
                  fluid
                  h={"80vh"}
                  bg={"body"}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  imageProps={{
                    unoptimized: true,
                  }}
                />

                <NavLink to={src} w={"fit"} external>
                  <Btn
                    size={"md"}
                    variant={"ghost"}
                    colorPalette={"light"}
                    pr={3}
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
