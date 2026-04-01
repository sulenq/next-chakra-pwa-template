"use client";

import { forwardRef } from "react";
import { StackProps, VStack } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface CContainerProps extends StackProps {
  children?: React.ReactNode;
}

export const CContainer = forwardRef<HTMLDivElement, CContainerProps>(
  function CContainer(props, ref) {
    // Props
    const { children, ...restProps } = props;

    return (
      <VStack
        ref={ref}
        className={"CContainer"}
        gap={0}
        align={"stretch"}
        w={"full"}
        {...restProps}
      >
        {children}
      </VStack>
    );
  },
);
