"use client";

import { CContainer } from "@/components/ui/c-container";
import { Props__ItemContainer } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { forwardRef } from "react";

export const ItemContainer = forwardRef<HTMLDivElement, Props__ItemContainer>(
  (props, ref) => {
    // Props
    const { children, scrollY = false, ...restProps } = props;

    // Contexts
    const { themeConfig } = useThemeConfig();

    return (
      <CContainer
        ref={ref}
        className={scrollY ? "scrollY" : ""}
        bg={"body"}
        rounded={themeConfig.radii.container}
        border={"1px solid"}
        borderColor={"border.subtle"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  }
);

ItemContainer.displayName = "ItemContainer";
