"use client";

import { P, PProps } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { ToggleTip } from "@/components/widgets/toggle-tip";
import { useHasHover } from "@/hooks/useHasHover";

// -----------------------------------------------------------------

export const ClampText = (props: PProps) => {
  const { children, ...restProps } = props;

  const hasHover = useHasHover();

  if (hasHover) {
    return (
      <Tooltip
        content={children}
        positioning={{
          placement: "bottom-start",
        }}
      >
        <P w={"fit"} lineClamp={1} {...restProps}>
          {children}
        </P>
      </Tooltip>
    );
  }

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
