import { type LucideIcon, type LucideProps } from "lucide-react";

interface Props__LucideIcon extends LucideProps {
  icon: LucideIcon;
}

export function LucideIcon({
  icon: Icon,
  size = 24,
  strokeWidth = 1.75,
  ...props
}: Props__LucideIcon) {
  return <Icon size={size} strokeWidth={strokeWidth} {...props} />;
}
