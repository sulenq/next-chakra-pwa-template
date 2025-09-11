"use client";

import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

interface Props extends StackProps {}

export const RouteContainer = forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <CContainer
        ref={ref}
        className="route-container"
        flex={1}
        p={4}
        pt={0}
        overflowY={"auto"}
        {...restProps}
      >
        {children}
      </CContainer>
    );
  }
);
RouteContainer.displayName = "RouteContainer";
