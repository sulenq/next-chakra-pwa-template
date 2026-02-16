import { NavLink } from "@/components/ui/nav-link";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { Props__NavLink } from "@/constants/props";
import { DESKTOP_NAVS_TOOLTIP_MAIN_AXIS } from "@/constants/styles";

export const DesktopNavTooltip = (props: TooltipProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <Tooltip
      positioning={{
        placement: "right",
        offset: {
          mainAxis: DESKTOP_NAVS_TOOLTIP_MAIN_AXIS,
        },
      }}
      {...restProps}
    >
      {children}
    </Tooltip>
  );
};

export const MobileNavLink = (props: Props__NavLink) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <NavLink
      minW={"50px"}
      align={"center"}
      gap={1}
      pos={"relative"}
      {...restProps}
    >
      {children}
    </NavLink>
  );
};
