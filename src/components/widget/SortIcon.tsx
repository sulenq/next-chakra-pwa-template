import { Props__SortIcon } from "@/constants/props";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon, VStack } from "@chakra-ui/react";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";

export const SortIcon = (props: Props__SortIcon) => {
  // Props
  const { columnIndex, sortColumnIdx, direction, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // States
  const active = sortColumnIdx === columnIndex;
  const asc = active && direction === "asc";
  const desc = active && direction === "desc";
  const ascColor = asc ? themeConfig.primaryColor : "d3";
  const descColor = desc ? themeConfig.primaryColor : "d3";

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
