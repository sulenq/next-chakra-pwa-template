"use client";

import { CContainer } from "@/components/ui/c-container";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import {
  Skeleton as ChakraSkeleton,
  SkeletonProps,
  StackProps,
} from "@chakra-ui/react";

// -----------------------------------------------------------------

export const Skeleton = (props: SkeletonProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <ChakraSkeleton
      rounded={themeConfig.radii.component}
      variant={"shine"}
      css={{
        "--start-color": "transparent",
        "--end-color": "colors.bg.subtle",
      }}
      {...props}
    />
  );
};

// -----------------------------------------------------------------

export const TableSkeleton = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  return (
    <CContainer p={3} pt={2} flex={1} {...restProps}>
      <Skeleton flex={1} />
    </CContainer>
  );
};
