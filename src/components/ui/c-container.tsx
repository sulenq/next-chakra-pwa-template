"use client";

import { StackV } from "@/components/ui/stack";
import { StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

interface CContainerProps extends StackProps {
  children?: React.ReactNode;
}

export const CContainer = forwardRef<HTMLDivElement, CContainerProps>(
  function CContainer(props, ref) {
    // Props
    const { children, ...restProps } = props;

    return (
      <StackV
        ref={ref}
        className={"CContainer"}
        gap={0}
        align={"stretch"}
        w={"full"}
        {...restProps}
      >
        {children}
      </StackV>
    );
  },
);
