"use client";

import { CContainer } from "@/components/ui/c-container";
import { ClampText } from "@/components/widget/ClampText";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { last } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { getActiveNavs } from "@/utils/url";
import { HStack, StackProps } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";

export const PageContainer = forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <CContainer
        ref={ref}
        className="page-container"
        flex={1}
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

export const PageTitle = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  // Contexts
  const { l } = useLang();

  // Hooks
  const pathname = usePathname();

  // States
  const activeNavs = getActiveNavs(pathname);
  const title = pluckString(l, last<any>(activeNavs)?.labelKey);

  return (
    <HStack flexShrink={0} px={4} overflow={"auto"} my={3} {...restProps}>
      <ClampText fontSize={"xl"} fontWeight={"semibold"}>
        {title}
      </ClampText>

      {children}
    </HStack>
  );
};

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
