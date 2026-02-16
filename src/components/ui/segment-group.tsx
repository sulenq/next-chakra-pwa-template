"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { SegmentGroup, SegmentGroupRootProps } from "@chakra-ui/react";

interface Props extends Omit<SegmentGroupRootProps, "onChange"> {
  items?: string[];
  inputValue?: string;
  onChange?: (inputValue: string) => void;
}

export const Segmented = (props: Props) => {
  // Props
  const { items = [], inputValue, onChange, size = "md", ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const hBySize: Record<any, any> = {
    xs: "32px",
    sm: "36px",
    md: "40px",
    lg: "44px",
    xl: "46px",
    "2xl": "50px",
  };

  return (
    <SegmentGroup.Root
      value={inputValue}
      onValueChange={(e) => onChange?.(e.value as string)}
      bg={"body"}
      rounded={themeConfig.radii.component}
      overflow={"clip"}
      shadow={"none"}
      border={"1px solid"}
      borderColor={"border.muted !important"}
      {...restProps}
    >
      <SegmentGroup.Indicator
        shadow={"none"}
        // border={"1px solid"}
        borderColor={"border.muted"}
        bg={"bg.muted"}
        h={hBySize[size as any]}
      />
      <SegmentGroup.Items
        items={items}
        cursor={"pointer"}
        h={hBySize[size as any]}
      />
    </SegmentGroup.Root>
  );
};
