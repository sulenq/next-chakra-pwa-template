import { Props__SortIcon } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon } from "@chakra-ui/react";
import {
  IconCaretDownFilled,
  IconCaretUpDownFilled,
  IconCaretUpFilled,
} from "@tabler/icons-react";

export const SortIcon = (props: Props__SortIcon) => {
  // Props
  const { columnIndex, sortColumnIdx, direction, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  if (sortColumnIdx === columnIndex) {
    return direction === "asc" ? (
      <Icon boxSize={4} color={themeConfig.primaryColor}>
        <IconCaretUpFilled />
      </Icon>
    ) : (
      <Icon boxSize={4} color={themeConfig.primaryColor}>
        <IconCaretDownFilled />
      </Icon>
    );
  }

  return (
    <Icon boxSize={4} color={"d3"} {...restProps}>
      <IconCaretUpDownFilled stroke={1.5} />
    </Icon>
  );
};
