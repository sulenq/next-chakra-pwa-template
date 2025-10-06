"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { Skeleton as ChakraSkeleton, SkeletonProps } from "@chakra-ui/react";

interface Props extends SkeletonProps {}

export const Skeleton = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <ChakraSkeleton rounded={themeConfig.radii.component} {...restProps} />
  );
};
