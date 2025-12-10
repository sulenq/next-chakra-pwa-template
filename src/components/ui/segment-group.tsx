"use client";

import { SegmentGroup, SegmentGroupRootProps } from "@chakra-ui/react";

interface Props extends Omit<SegmentGroupRootProps, "onChange"> {
  items?: string[];
  inputValue?: string;
  onChange?: (inputValue: string) => void;
}

export const Segmented = (props: Props) => {
  // Props
  const { items = [], inputValue, onChange, ...restProps } = props;

  return (
    <SegmentGroup.Root
      value={inputValue}
      onValueChange={(e) => onChange?.(e.value as string)}
      bg={"body"}
      {...restProps}
    >
      <SegmentGroup.Indicator
        shadow={"none"}
        border={"1px solid"}
        borderColor={"border.muted"}
        bg={"bg.muted"}
      />
      <SegmentGroup.Items items={items} cursor={"pointer"} />
    </SegmentGroup.Root>
  );
};
