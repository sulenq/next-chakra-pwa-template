"use client";

import { ToggleTip } from "@/components/overlays/toggle-tip";
import { P, PProps } from "@/components/ui/p";
import { Tooltip } from "@/components/ui/tooltip";
import { useHasHover } from "@/hooks/use-has-hover";

// -----------------------------------------------------------------

export const ClampText = (props: PProps) => {
  // Props
  const { children, ...restProps } = props;

  // Hooks
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
