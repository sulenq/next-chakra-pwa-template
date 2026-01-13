"use client";

import { P } from "@/components/ui/p";
import SimplePopover from "@/components/widget/SimplePopover";
import { TextProps } from "@chakra-ui/react";

export const ClampText = (props: TextProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <SimplePopover content={<P>{children}</P>}>
      <P w={"full"} lineClamp={1} cursor={"pointer"} {...restProps}>
        {children}
      </P>
    </SimplePopover>
  );
};
