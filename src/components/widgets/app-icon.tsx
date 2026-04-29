"use client";

import { LucideIcon as LucideIconComponent } from "@/components/widgets/icon";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import { Icon, IconProps } from "@chakra-ui/react";
import { type LucideIcon, type LucideProps } from "lucide-react";

// -----------------------------------------------------------------

export interface AppLucideIconProps extends IconProps {
  icon?: LucideIcon;
  lucideIconProps?: LucideProps;
}

export const AppIconLucide = (props: AppLucideIconProps) => {
  // Props
  const { icon, lucideIconProps, ...restProps } = props;

  return (
    icon && (
      <Icon boxSize={BASE_ICON_BOX_SIZE} {...restProps}>
        <LucideIconComponent icon={icon} {...lucideIconProps} />
      </Icon>
    )
  );
};
