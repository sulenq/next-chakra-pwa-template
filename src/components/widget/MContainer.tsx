import { forwardRef } from "react";
import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";

interface Props__VerticalMaskingContainer extends StackProps {
  top?: string | number;
  bottom?: string | number;
}

export const MContainer = forwardRef<
  HTMLDivElement,
  Props__VerticalMaskingContainer
>(function MContainer(props, ref) {
  const { top = "8px", bottom = "8px", style, children, ...restProps } = props;

  const mask = `linear-gradient(
      to bottom,
      transparent 0,
      black ${top},
      black calc(100% - ${bottom}),
      transparent 100%
    )`;

  return (
    <CContainer
      ref={ref}
      style={{
        WebkitMaskImage: mask,
        maskImage: mask,
        ...style,
      }}
      {...restProps}
    >
      {children}
    </CContainer>
  );
});
