"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import { StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export interface ItemContainerProps extends StackProps {
  scrollY?: boolean;
  roundedless?: boolean;
  borderless?: boolean;
}
export const ItemContainer = forwardRef<HTMLDivElement, ItemContainerProps>(
  (props, ref) => {
    // Props
    const {
      children,
      scrollY = false,
      className,
      roundedless = false,
      borderless = false,
      ...restProps
    } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <CContainer
        ref={ref}
        className={`${scrollY ? "scrollY" : ""} ${className}`}
        bg={"body"}
        rounded={roundedless ? "" : themeConfig.radii.container}
        border={borderless ? "" : "1px solid"}
        borderColor={"border.muted"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  },
);

ItemContainer.displayName = "ItemContainer";
