import { type LucideIcon, type LucideProps } from "lucide-react";

// -----------------------------------------------------------------

interface LucideIconProps extends LucideProps {
  icon?: LucideIcon;
}

export function LucideIcon(props: LucideIconProps) {
  // Props
  const { icon: Icon, size = 24, strokeWidth = 1.75, ...restProps } = props;

  return Icon && <Icon size={size} strokeWidth={strokeWidth} {...restProps} />;
}
