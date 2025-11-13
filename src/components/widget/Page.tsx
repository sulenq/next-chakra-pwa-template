"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/context/useThemeConfig";
import { StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const PageContainer = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <CContainer
        ref={ref}
        flex={1}
        gap={4}
        p={[2, null, 4]}
        pt={"0 !important"}
        overflow={"auto"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  }
);

PageContainer.displayName = "PageContainer";

export const PageContent = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const { children, ...restProps } = props;
    const { themeConfig } = useThemeConfig();

    return (
      <CContainer
        ref={ref}
        flex={1}
        bg={"body"}
        rounded={themeConfig.radii.container}
        overflow={"auto"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  }
);

PageContent.displayName = "PageContent";
