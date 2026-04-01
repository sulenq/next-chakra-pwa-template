"use client";

import { CContainer } from "@/components/ui/c-container";
import { SVGS_PATH } from "@/constants/paths";
import { Center, CenterProps, Icon, StackProps } from "@chakra-ui/react";
import { ImageIcon, LucideIcon } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { forwardRef, useEffect, useState } from "react";

// -----------------------------------------------------------------

interface ImgFallbackProps extends CenterProps {
  icon?: LucideIcon;
}

export const ImgFallback = (props: ImgFallbackProps) => {
  // Props
  const { icon: LucideIcon = ImageIcon, ...restProps } = props;

  return (
    <Center
      w={"full"}
      h={"fit"}
      aspectRatio={1}
      bg={"bg.muted"}
      pos={"relative"}
      {...restProps}
    >
      <Icon boxSize={"50%"} opacity={0.1}>
        <LucideIcon strokeWidth={1} />
      </Icon>
    </Center>
  );
};

// -----------------------------------------------------------------

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
  fallbackProps?: CenterProps;
}

export const Img = forwardRef<HTMLImageElement, ImgProps>(
  function Img(props, ref) {
    const {
      src,
      alt,
      onError,
      objectFit,
      objectPos,
      imageProps,
      fluid,
      fallbackSrc,
      fallback,
      fallbackProps,
      wide,
      ...restProps
    } = props;

    const resolvedFallback = fallback ?? <ImgFallback {...fallbackProps} />;

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
        w={"auto"}
        h={"auto"}
        justify={"center"}
        align={"center"}
        pos={"relative"}
        overflow={restProps.rounded ? "clip" : ""}
        {...restProps}
      >
        {isError && resolvedFallback ? (
          resolvedFallback
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
  },
);
