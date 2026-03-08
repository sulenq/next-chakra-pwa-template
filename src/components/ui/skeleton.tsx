"use client";

import { useThemeConfig } from "@/contexts/useThemeConfig";
import { Skeleton as ChakraSkeleton, SkeletonProps } from "@chakra-ui/react";

export const Skeleton = (props: SkeletonProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return <ChakraSkeleton rounded={themeConfig.radii.component} {...props} />;
};
