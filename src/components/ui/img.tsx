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
    fallbackSrc ??
    (wide ? `${SVGS_PATH}/no-img-wide.svg` : `${SVGS_PATH}/no-img.svg`);
  const [currentSrc, setCurrentSrc] = useState(src || resolvedFallbackSrc);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If the current source is not already the fallback, switch to the fallback source.
    if (currentSrc !== resolvedFallbackSrc) {
      setCurrentSrc(resolvedFallbackSrc);
    }
    // Propagate the original error event if an external handler is provided
    if (onError) onError(e);
  };

  return (
    <CContainer
      w={"auto"}
      h={"auto"}
      justify={"center"}
      align={"center"}
      pos={"relative"}
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
          width: "100%",
          height: "100%",
        }}
        fill={!fluid}
        width={fluid ? 0 : undefined}
        height={fluid ? 0 : undefined}
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
