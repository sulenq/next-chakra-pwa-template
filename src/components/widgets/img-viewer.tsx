"use client";

import { Btn } from "@/components/ui/btn";
import { CloseButton } from "@/components/ui/close-button";
import { Dialog } from "@/components/ui/dialog";
import { Img } from "@/components/ui/img";
import { NavLink } from "@/components/ui/nav-link";
import { StackV } from "@/components/ui/stack";
import { useLocale } from "@/contexts/use-locale-context";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { back } from "@/utils/client";
import { disclosureId } from "@/utils/disclosure";
import { Icon, StackProps } from "@chakra-ui/react";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useEffect, useState } from "react";

// -----------------------------------------------------------------

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

  // States
  const [isError, setIsError] = useState(!src);

  useEffect(() => {
    setIsError(!src);
  }, [src]);

  return (
    <>
      <StackV
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
      </StackV>

      <Dialog.Root open={open} size={"full"} scrollBehavior={"inside"}>
        <Dialog.Content
          bg={"transparent"}
          backdropFilter={"none"}
          onClick={back}
        >
          <Dialog.Body p={0} overflow={"auto"}>
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
                top={0}
                right={0}
                zIndex={2}
              />

              <StackV flex={1} gap={4} align={"center"} overflow={"auto"}>
                <Img
                  src={src}
                  w={"full"}
                  maxW={"70svh"}
                  aspectRatio={1}
                  objectFit={"contain"}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  imageProps={{
                    unoptimized: true,
                    onLoad: () => {
                      if (src) setIsError(false);
                    },
                  }}
                  onError={() => setIsError(true)}
                  bg={!src || isError ? "bg.bodySolid" : "transparent"}
                  fallback={fallback}
                  fallbackSrc={fallbackSrc}
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
          </Dialog.Body>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
