"use client";

import { LucideIcon as LucideIconComponent } from "@/components/widget/Icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { Icon, IconProps } from "@chakra-ui/react";
import { type LucideIcon, type LucideProps } from "lucide-react";

interface Props extends IconProps {
  icon: LucideIcon;
  lucideIconProps?: LucideProps;
}

export const AppIcon = (props: Props) => {
  // Props
  const { icon, lucideIconProps, ...restProps } = props;

  return (
    <Icon boxSize={BASE_ICON_BOX_SIZE} {...restProps}>
      <LucideIconComponent icon={icon} {...lucideIconProps} />
    </Icon>
  );
};
