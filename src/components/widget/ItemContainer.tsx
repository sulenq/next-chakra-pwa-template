"use client";

import { CContainer } from "@/components/ui/c-container";
import { Props__ItemContainer } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";

export const ItemContainer = (props: Props__ItemContainer) => {
  // Props
  const { children, scrollY, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      className={scrollY ? "scrollY" : ""}
      h={"fit"}
      gap={2}
      bg={"body"}
      rounded={themeConfig.radii.container}
      {...restProps}
    >
      {children}
    </CContainer>
  );
};
