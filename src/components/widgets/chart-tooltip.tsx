import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { DotIndicator } from "@/components/widgets/indicator";
import { BLUR_RADIUS } from "@/constants/styles";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { HStack, Text } from "@chakra-ui/react";
import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export const ChartTooltip = (
  props: TooltipContentProps<ValueType, NameType>,
) => {
  // Props
  const { active, payload, label } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  if (!active || !payload || payload.length === 0) return null;

  return (
    <CContainer
      gap={1}
      p={3}
      bg={"bg.frosted"}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={themeConfig.radii.component}
      shadow={"soft"}
      backdropFilter={`blur(${BLUR_RADIUS})`}
    >
      <P fontWeight={"semibold"} mb={1}>
        {label}
      </P>

      <CContainer gap={1}>
        {payload.map((entry, index) => {
          return (
            <HStack key={index}>
              <DotIndicator color={entry.color} />

              <Text fontSize="sm">
                {entry.name}: {entry.value}
              </Text>
            </HStack>
          );
        })}
      </CContainer>
    </CContainer>
  );
};
