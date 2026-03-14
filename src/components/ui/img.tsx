"use client";

import { CContainer } from "@/components/ui/c-container";
import { SVGS_PATH } from "@/constants/paths";
import { Center, StackProps } from "@chakra-ui/react";
import { MediaImage } from "iconoir-react";
import Image, { ImageProps } from "next/image";
import { forwardRef, useEffect, useState } from "react";

export const ImgFallback = (props: StackProps) => {
  return (
    <Center w={"full"} h={"full"} bg={"bg.subtle"} pos={"relative"} {...props}>
      <MediaImage
        width={"50%"}
        height={"50%"}
        strokeWidth={"1"}
        color={"var(--chakra-colors-fg-subtle)"}
        opacity={0.2}
      />
    </Center>
  );
};

export interface ImgProps extends StackProps {
  src?: string;
  alt?: string;
  objectFit?: string;
  objectPos?: string;
  fluid?: boolean;
  fallbackSrc?: string;
  fallback?: React.ReactNode;
  wide?: boolean;
  imageProps?: Omit<ImageProps, "src" | "width" | "height" | "alt">;
}
export const Img = forwardRef<HTMLImageElement, ImgProps>((props, ref) => {
  const {
    src,
    alt,
    onError,
    objectFit,
    objectPos,
    imageProps,
    fluid,
    fallbackSrc,
    fallback = <ImgFallback />,
    wide,
    ...restProps
  } = props;

  const resolvedFallbackSrc =
    fallbackSrc ??
    (wide ? `${SVGS_PATH}/no-img-wide.svg` : `${SVGS_PATH}/no-img.svg`);

  const [currentSrc, setCurrentSrc] = useState(src || resolvedFallbackSrc);
  const [isError, setIsError] = useState(!src);

  useEffect(() => {
    setCurrentSrc(src || resolvedFallbackSrc);
    setIsError(!src);
  }, [src, resolvedFallbackSrc]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsError(true);
    if (src && currentSrc !== resolvedFallbackSrc) {
      setCurrentSrc(resolvedFallbackSrc);
    }
    if (onError) onError(e);
  };

  return (
    <CContainer
      w="auto"
      h="auto"
      justify="center"
      align="center"
      pos="relative"
      overflow={restProps.rounded ? "clip" : ""}
      {...restProps}
    >
      {isError && fallback ? (
        fallback
      ) : (
        <Image
          ref={ref}
          src={currentSrc}
          alt={alt || "image"}
          onError={handleError}
          onLoad={() => {
            if (currentSrc === src) {
              setIsError(false);
            }
          }}
          style={{
            objectFit: (objectFit as any) ?? "cover",
            objectPosition: objectPos ?? "center",
            width: "100%",
            height: "100%",
          }}
          fill={!fluid}
          width={fluid ? 0 : undefined}
          height={fluid ? 0 : undefined}
          quality={100}
          sizes={
            imageProps?.sizes ??
            "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          }
          {...imageProps}
        />
      )}
    </CContainer>
  );
});

Img.displayName = "Img";
