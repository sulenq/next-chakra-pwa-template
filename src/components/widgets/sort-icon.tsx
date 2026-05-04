import { useThemeConfig } from "@/contexts/use-theme-context";
import { Icon, IconProps, VStack } from "@chakra-ui/react";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";

// -----------------------------------------------------------------

export interface SortIconProps extends IconProps {
  columnIndex: number;
  sortColumnIdx?: number;
  direction: "asc" | "desc";
}

export const SortIcon = (props: SortIconProps) => {
  // Props
  const { columnIndex, sortColumnIdx, direction, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeConfig();

  // States
  const active = sortColumnIdx === columnIndex;
  const asc = active && direction === "asc";
  const desc = active && direction === "desc";
  const ascColor = asc ? themeContext.primaryColor : "d3";
  const descColor = desc ? themeContext.primaryColor : "d3";

  return (
    <VStack gap={0}>
      <Icon boxSize={"15px"} color={ascColor} mb={"-4.5px"} {...restProps}>
        <IconCaretUpFilled />
      </Icon>

      <Icon boxSize={"15px"} color={descColor} mt={"-4.5px"} {...restProps}>
        <IconCaretDownFilled />
      </Icon>
    </VStack>
  );
};
