"use client";

import { CContainer } from "@/components/ui/c-container";
import { Skeleton } from "@/components/ui/skeleton";
import { StackProps } from "@chakra-ui/react";

export const TableSkeleton = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  return (
    <CContainer p={3} pt={2} flex={1} {...restProps}>
      <Skeleton flex={1} />
    </CContainer>
  );
};
