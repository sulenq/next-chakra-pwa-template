"use client";

import { IMAGES_PATH } from "@/constants/paths";
import { Props__Img } from "@/constants/props";
import Image from "next/image";
import { useState } from "react";

export const Img = (props: Props__Img) => {
  // Props
  const { src, onError, objectFit, objectPos, ...restProps } = props;

  // States
  const fallbackSrc = `${IMAGES_PATH}/no_img.jpeg`;
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
    if (onError) onError(e);
  };

  return (
    <Image
      src={currentSrc}
      onError={handleError}
      style={{
        objectFit: (objectFit as any) ?? "cover",
        objectPosition: objectPos ?? "top",
      }}
      {...restProps}
    />
  );
};
