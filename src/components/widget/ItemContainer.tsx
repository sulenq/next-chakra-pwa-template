"use client";

import { CContainer } from "@/components/ui/c-container";
import { Props__ItemContainer } from "@/constants/props";
import { forwardRef } from "react";

export const ItemContainer = forwardRef<HTMLDivElement, Props__ItemContainer>(
  (props, ref) => {
    // Props
    const { children, scrollY = false, ...restProps } = props;

    // Contexts
    // const { themeConfig } = useThemeConfig();

    return (
      <CContainer
        ref={ref} // <-- ref diterusin ke CContainer
        className={scrollY ? "scrollY" : ""}
        bg={"body"}
        // rounded={themeConfig.radii.container}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  }
);

ItemContainer.displayName = "ItemContainer";
