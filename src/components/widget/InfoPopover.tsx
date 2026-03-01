"use client";

import { Btn, Props__Btn } from "@/components/ui/btn";
import { LucideIcon } from "@/components/widget/Icon";
import SimplePopover from "@/components/widget/SimplePopover";
import { Icon } from "@chakra-ui/react";
import { InfoIcon } from "lucide-react";

interface Props extends Props__Btn {
  popoverContent?: string;
}

export const InfoPopover = (props: Props) => {
  // Props
  const { popoverContent, ...restProps } = props;

  return (
    <SimplePopover content={popoverContent}>
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
    </SimplePopover>
  );
};
