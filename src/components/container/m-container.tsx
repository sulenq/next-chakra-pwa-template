"use client";

import { StackV } from "@/components/ui/stack";
import { StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface MContainerVProps extends StackProps {
  maskingTop?: string | number;
  maskingBottom?: string | number;
}

export const MContainerV = forwardRef<HTMLDivElement, MContainerVProps>(
  function MContainerV(props, ref) {
    const {
      maskingTop = "8px",
      maskingBottom = "8px",
      style,
      children,
      ...restProps
    } = props;

    const toPx = (v: string | number) => (typeof v === "number" ? `${v}px` : v);

    const top = toPx(maskingTop);
    const bottom = toPx(maskingBottom);

    const mask = `
      linear-gradient(
        to bottom,
        transparent 0,
        black ${top},
        black calc(100% - ${bottom}),
        transparent 100%
      )
    `;

    return (
      <StackV
        ref={ref}
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          ...style,
        }}
        {...restProps}
      >
        {children}
      </StackV>
    );
  },
);

// -----------------------------------------------------------------

export interface MContainerHProps extends StackProps {
  maskingLeft?: string | number;
  maskingRight?: string | number;
}

export const MContainerH = forwardRef<HTMLDivElement, MContainerHProps>(
  function MContainerH(props, ref) {
    const {
      maskingLeft = "8px",
      maskingRight = "8px",
      style,
      children,
      ...restProps
    } = props;

    const toPx = (v: string | number) => (typeof v === "number" ? `${v}px` : v);

    const left = toPx(maskingLeft);
    const right = toPx(maskingRight);

    const mask = `
    linear-gradient(
      to right,
      transparent 0,
      black ${left},
      black calc(100% - ${right}),
      transparent 100%
    )
  `;

    return (
      <StackV
        ref={ref}
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          ...style,
        }}
        {...restProps}
      >
        {children}
      </StackV>
    );
  },
);
