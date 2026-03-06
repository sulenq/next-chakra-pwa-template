"use client";

import { CContainer } from "@/components/ui/c-container";
import { SVGS_PATH } from "@/constants/paths";
import { StackProps } from "@chakra-ui/react";
import Image, { ImageProps } from "next/image";
import { forwardRef, useState } from "react";

export interface ImgProps extends StackProps {
  src?: string;
  alt?: string;
  objectFit?: string;
  objectPos?: string;
  fluid?: boolean;
  fallbackSrc?: string;
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
    wide,
    ...restProps
  } = props;

  const resolvedFallbackSrc =
    fallbackSrc ??
    (wide ? `${SVGS_PATH}/no-img-wide.svg` : `${SVGS_PATH}/no-img.svg`);

  const [currentSrc, setCurrentSrc] = useState(src || resolvedFallbackSrc);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== resolvedFallbackSrc) {
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
      <Image
        ref={ref}
        src={currentSrc}
        alt={alt || "image"}
        onError={handleError}
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
    </CContainer>
  );
});

Img.displayName = "Img";
