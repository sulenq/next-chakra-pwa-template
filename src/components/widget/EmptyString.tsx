"use client";

import { P } from "@/components/ui/p";
import { TextProps } from "@chakra-ui/react";

export const EmptyString = (props: TextProps) => {
  return (
    <P color={"fg.subtle"} {...props}>
      -
    </P>
  );
};
