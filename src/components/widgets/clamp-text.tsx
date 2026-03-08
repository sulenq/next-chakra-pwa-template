"use client";

import { P, PProps } from "@/components/ui/p";
import ToggleTip from "@/components/widgets/toggle-tip";

export const ClampText = (props: PProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <ToggleTip
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
    </ToggleTip>
  );
};
