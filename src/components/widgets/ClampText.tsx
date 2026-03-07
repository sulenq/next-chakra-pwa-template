"use client";

import { P, PProps } from "@/components/ui/p";
import SimplePopover from "@/components/widgets/SimplePopover";

export const ClampText = (props: PProps) => {
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
