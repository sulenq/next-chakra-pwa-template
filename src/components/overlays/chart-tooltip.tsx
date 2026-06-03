import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { DotIndicator } from "@/components/ui/indicator";
import { BACKDROP_BLUR_FILTER } from "@/constants/styles";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { Text } from "@chakra-ui/react";
import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

// -----------------------------------------------------------------

export const ChartTooltip = (
  props: TooltipContentProps<ValueType, NameType>,
) => {
  // Props
  const { active, payload, label } = props;

  // Stores
  const { theme } = useThemeStore();

  if (!active || !payload || payload.length === 0) return null;

  return (
    <StackV>
      <StackV
        gap={1}
        p={3}
        bg={"bg.body"}
        border={"1px solid"}
        borderColor={"border.subtle"}
        rounded={theme.radii.component}
        shadow={"soft"}
        backdropFilter={BACKDROP_BLUR_FILTER}
      >
        <P fontWeight={"semibold"} mb={1}>
          {label}
        </P>

        <StackV gap={1}>
          {payload.map((entry, index) => {
            return (
              <StackH align={"center"} key={index}>
                <DotIndicator bg={entry.color} />

                <Text fontSize={"sm"}>
                  {entry.name}: {entry.value}
                </Text>
              </StackH>
            );
          })}
        </StackV>
      </StackV>
    </StackV>
  );
};
