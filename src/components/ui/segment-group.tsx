"use client";

import { useThemeConfig } from "@/contexts/useThemeConfig";
import { SegmentGroup, SegmentGroupRootProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface SegmentedProps extends Omit<SegmentGroupRootProps, "onChange"> {
  items?: any[];
  inputValue?: string;
  onChange?: (inputValue: string) => void;
}

export const Segmented = (props: SegmentedProps) => {
  // Props
  const { items = [], inputValue, onChange, size = "md", ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const hBySize: Record<any, any> = {
    xs: "30px",
    sm: "34px",
    md: "38px",
    lg: "42px",
    xl: "44px",
    "2xl": "48px",
  };

  return (
    <SegmentGroup.Root
      value={inputValue}
      onValueChange={(e) => onChange?.(e.value as string)}
      w={"fit"}
      bg={"transparent"}
      rounded={themeConfig.radii.component}
      overflow={"clip"}
      shadow={"none"}
      // border={"1px solid"}
      borderColor={"border.muted !important"}
      {...restProps}
    >
      <SegmentGroup.Indicator
        h={hBySize[size as any]}
        bg={"bg.muted"}
        // border={"1px solid"}
        borderColor={"border.muted"}
        rounded={themeConfig.radii.component}
        shadow={"none"}
      />

      <SegmentGroup.Items
        items={items}
        cursor={"pointer"}
        h={hBySize[size as any]}
        transform={"translateY(-1.5px)"}
      />
    </SegmentGroup.Root>
  );
};
