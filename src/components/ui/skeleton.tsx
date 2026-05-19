"use client";

import { StackV } from "@/components/ui/stack";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import {
  Skeleton as ChakraSkeleton,
  SkeletonProps,
  StackProps,
} from "@chakra-ui/react";

// -----------------------------------------------------------------

export const Skeleton = (props: SkeletonProps) => {
  // Contexts
  const { themeContext } = useThemeContext();

  return (
    <ChakraSkeleton
      rounded={themeContext.radii.component}
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
    <StackV p={3} flex={1} {...restProps}>
      <Skeleton flex={1} />
    </StackV>
  );
};
