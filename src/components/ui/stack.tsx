"use client";

import { Flex, StackProps } from "@chakra-ui/react";
import { forwardRef } from "react";

export const StackV = forwardRef<HTMLDivElement, StackProps>(
  function StackV(props, ref) {
    return (
      <Flex
        ref={ref}
        className={"stack-v"}
        flexDir={"column"}
        align={"stretch"}
        {...props}
      />
    );
  },
);

export const StackH = forwardRef<HTMLDivElement, StackProps>(
  function StackH(props, ref) {
    return (
      <Flex
        ref={ref}
        className={"stack-h"}
        flexDir={"row"}
        align={"stretch"}
        {...props}
      />
    );
  },
);
