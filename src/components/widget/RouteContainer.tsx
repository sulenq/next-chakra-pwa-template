"use client";

import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";

interface Props extends StackProps {}

export const RouteContainer = (props: Props) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <CContainer
      className="route-container"
      flex={1}
      p={4}
      pt={0}
      pl={0}
      overflowY={"auto"}
      {...restProps}
    >
      {children}
    </CContainer>
  );
};
