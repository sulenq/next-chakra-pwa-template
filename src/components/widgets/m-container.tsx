import { forwardRef } from "react";
import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";

export interface MContainerProps extends StackProps {
  maskingTop?: string | number;
  maskingBottom?: string | number;
  maskingLeft?: string | number;
  maskingRight?: string | number;
  fade?: boolean;
}

export const MContainer = forwardRef<HTMLDivElement, MContainerProps>(
  function MContainer(props, ref) {
    const {
      maskingTop = "8px",
      maskingBottom = "8px",
      maskingLeft = "0px",
      maskingRight = "0px",
      fade = true,
      style,
      children,
      ...restProps
    } = props;

    const verticalMask = fade
      ? `linear-gradient(
          to bottom,
          transparent 0,
          black ${maskingTop},
          black calc(100% - ${maskingBottom}),
          transparent 100%
        )`
      : `linear-gradient(
          to bottom,
          transparent 0,
          transparent ${maskingTop},
          black ${maskingTop},
          black calc(100% - ${maskingBottom}),
          transparent calc(100% - ${maskingBottom}),
          transparent 100%
        )`;

    const horizontalMask = fade
      ? `linear-gradient(
          to right,
          transparent 0,
          black ${maskingLeft},
          black calc(100% - ${maskingRight}),
          transparent 100%
        )`
      : `linear-gradient(
          to right,
          transparent 0,
          transparent ${maskingLeft},
          black ${maskingLeft},
          black calc(100% - ${maskingRight}),
          transparent calc(100% - ${maskingRight}),
          transparent 100%
        )`;

    return (
      <CContainer
        ref={ref}
        style={{
          WebkitMaskImage: `${verticalMask}, ${horizontalMask}`,
          maskImage: `${verticalMask}, ${horizontalMask}`,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
          ...style,
        }}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  },
);
