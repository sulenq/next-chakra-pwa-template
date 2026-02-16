"use client";

import { CContainer } from "@/components/ui/c-container";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeConfig } from "@/context/useThemeConfig";
import { StackProps } from "@chakra-ui/react";

export const TableSkeleton = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer p={3} pt={2} flex={1} {...restProps}>
      <Skeleton flex={1} rounded={themeConfig.radii.container} />
    </CContainer>
  );
};
