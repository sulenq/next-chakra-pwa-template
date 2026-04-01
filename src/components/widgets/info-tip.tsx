"use client";

import { Btn, BtnProps } from "@/components/ui/btn";
import { LucideIcon } from "@/components/widgets/icon";
import { ToggleTip } from "@/components/widgets/toggle-tip";
import { Icon } from "@chakra-ui/react";
import { InfoIcon } from "lucide-react";

// -----------------------------------------------------------------

interface InfoTooltipProps extends BtnProps {
  popoverContent?: string;
}

export const InfoTip = (props: InfoTooltipProps) => {
  // Props
  const { popoverContent, ...restProps } = props;

  return (
    <ToggleTip content={popoverContent}>
      <Btn
        clicky={false}
        iconButton
        size={"2xs"}
        rounded={"full"}
        variant={"ghost"}
        color={"fg.subtle"}
        {...restProps}
      >
        <Icon>
          <LucideIcon icon={InfoIcon} />
        </Icon>
      </Btn>
    </ToggleTip>
  );
};
