"use client";

import { P } from "@/components/ui/p";
import SimplePopover from "@/components/widget/SimplePopover";
import { TextProps } from "@chakra-ui/react";

export const ClampText = (props: TextProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <SimplePopover content={<P>{children}</P>}>
      <P lineClamp={1} w={"max"} maxW={"300px"} {...restProps}>
        {children}
      </P>
    </SimplePopover>
  );
};
