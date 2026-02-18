"use client";

import { P } from "@/components/ui/p";
import SimplePopover from "@/components/widget/SimplePopover";
import { TextProps } from "@chakra-ui/react";

export const ClampText = (props: TextProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <SimplePopover
      content={children}
      rootProps={{
        positioning: {
          placement: "bottom-start",
        },
      }}
    >
      <P w={"fit"} lineClamp={1} cursor={"pointer"} {...restProps}>
        {children}
      </P>
    </SimplePopover>
  );
};
