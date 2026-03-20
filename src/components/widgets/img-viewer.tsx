"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { CloseButton } from "@/components/ui/close-button";
import { DialogBody, DialogContent, DialogRoot } from "@/components/ui/dialog";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { StackV } from "@/components/ui/stack";
import { useLocale } from "@/contexts/useLocale";
import { useColorBody } from "@/hooks/useColorBody";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { Icon, StackProps } from "@chakra-ui/react";
import { IconArrowUpRight } from "@tabler/icons-react";

interface ImgViewerProps extends StackProps {
  id?: string;
  src?: string;
  fallback?: React.ReactNode;
  fallbackSrc?: string;
  disabled?: boolean;
}
export const ImgViewer = (props: ImgViewerProps) => {
  // Props
  const {
    children,
    id,
    src,
    fallback,
    fallbackSrc,
    disabled = false,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();

  // Hooks
  const { open, onOpen } = usePopDisclosure(disclosureId(id || `${src}`));

  // SX
  const FALLBACK_BG = useColorBody();

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

      <DialogRoot open={open} size={"full"} scrollBehavior={"inside"}>
        <DialogContent bg={"transparent"} onClick={back}>
          <DialogBody p={0} overflow={"auto"}>
            <StackV
              flex={1}
              h={"calc(100svh - 32px)"}
              justify={"center"}
              overflow={"auto"}
              pos={"relative"}
            >
              <CloseButton
                colorPalette={"light"}
                w={"fit"}
                onClick={(e) => {
                  e.stopPropagation();
                  back();
                }}
                rounded={"full"}
                pos={"absolute"}
                top={4}
                right={4}
                zIndex={2}
              />

              <StackV flex={1} gap={4} align={"center"} p={8} overflow={"auto"}>
                <Img
                  src={src}
                  w={"fit"}
                  h={"70%"}
                  aspectRatio={1}
                  objectFit={"contain"}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  imageProps={{
                    unoptimized: true,
                  }}
                  fallback={fallback}
                  fallbackSrc={fallbackSrc}
                  fallbackProps={{
                    bg: FALLBACK_BG,
                  }}
                  m={"auto"}
                />

                <NavLink to={src} w={"fit"} external>
                  <Btn
                    size={"md"}
                    variant={"ghost"}
                    colorPalette={"light"}
                    pr={3}
                  >
                    {t.open}
                    <Icon>
                      <IconArrowUpRight stroke={1.5} />
                    </Icon>
                  </Btn>
                </NavLink>
              </StackV>
            </StackV>
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
