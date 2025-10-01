"use client";

import { CContainer } from "@/components/ui/c-container";
import { SVGS_PATH } from "@/constants/paths";
import { Props__Img } from "@/constants/props";
import Image from "next/image";
import { useState } from "react";

export const Img = (props: Props__Img) => {
  // Props
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

  // States
  const resolvedFallbackSrc =
    fallbackSrc || wide
      ? `${SVGS_PATH}/no-img-wide.svg`
      : `${SVGS_PATH}/no-img.svg`;
  const [currentSrc, setCurrentSrc] = useState(src || resolvedFallbackSrc);

  // Utils
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== resolvedFallbackSrc) {
      setCurrentSrc(resolvedFallbackSrc);
    }
    if (onError) onError(e);
  };

  return (
    <CContainer
      justify="center"
      align="center"
      pos="relative"
      overflow={restProps.rounded ? "clip" : ""}
      {...restProps}
    >
      <Image
        src={currentSrc}
        alt={alt || "image"}
        onError={handleError}
        style={{
          objectFit: (objectFit as any) ?? "cover",
          objectPosition: objectPos ?? "center",
        }}
        fill={!fluid}
        width={fluid ? undefined : 0}
        height={fluid ? undefined : 0}
        quality={80}
        sizes={
          imageProps?.sizes ??
          "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        {...imageProps}
      />
    </CContainer>
  );
};
