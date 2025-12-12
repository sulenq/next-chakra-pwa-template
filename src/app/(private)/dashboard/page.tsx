"use client";

import { CContainer } from "@/components/ui/c-container";
import { DateRangePickerInput } from "@/components/ui/date-range-picker-input";
import { P } from "@/components/ui/p";
import { Segmented } from "@/components/ui/segment-group";
import { ClampText } from "@/components/widget/ClampText";
import HScroll from "@/components/widget/HScroll";
import { LucideIcon } from "@/components/widget/Icon";
import { InfoPopover } from "@/components/widget/InfoPopover";
import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/Page";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { formatNumber } from "@/utils/formatter";
import { isDimensionValid } from "@/utils/style";
import { Badge, HStack, Icon, SimpleGrid, StackProps } from "@chakra-ui/react";
import { ArrowUpIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Chart, useChart } from "@chakra-ui/charts";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
} from "recharts";
import { MONTHS } from "@/constants/months";

const DEFAULT_FILTER = {
  startDate: null,
  endDate: null,
};

const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack {...restProps}>
      <DateRangePickerInput
        id="date_period"
        inputValue={{
          startDate: filter.startDate,
          endDate: filter.endDate,
        }}
        onChange={(inputValue) => {
          setFilter({
            ...filter,
            startDate: inputValue?.startDate,
            endDate: inputValue?.endDate,
          });
        }}
        w={"270px"}
        size={"sm"}
      />
    </HStack>
  );
};
const OverviewItem = (props: StackProps) => {
  return (
    <CContainer
      p={4}
      pt={3}
      border={"1px solid"}
      borderColor={"border.subtle"}
      rounded={"md"}
      {...props}
    >
      <HStack gap={1}>
        <P fontWeight={"medium"} color={"fg.muted"}>
          Title here
        </P>

        <InfoPopover
          popoverContent={
            "Id enim cupidatat do do et consectetur voluptate voluptate nulla nulla amet nostrud quis non."
          }
        />
      </HStack>

      <P fontSize={"2xl"} fontWeight={"medium"}>
        {formatNumber(1234)}
      </P>

      <HStack mt={2}>
        <Badge w={"fit"} colorPalette={"green"}>
          <Icon boxSize={2.5}>
            <LucideIcon icon={ArrowUpIcon} />
          </Icon>
          12.5%
        </Badge>

        <ClampText fontSize={"sm"} color={"fg.subtle"}>
          since last month
        </ClampText>
      </HStack>
    </CContainer>
  );
};

const Chart1 = (props: any) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [timeFrame, setTimeFrame] = useState<string>("1D");
  const chart = useChart({
    data: data?.[timeFrame]?.map((item: any, i: number) => ({
      budget: item.value,
      month: MONTHS[lang][i],
    })),
  });

  return (
    <ItemContainer {...restProps}>
      <ItemHeaderContainer borderless withUtils>
        <ItemHeaderTitle
          color={"fg.muted"}
          popoverContent={
            "Id enim cupidatat do do et consectetur voluptate voluptate nulla nulla amet nostrud quis non."
          }
        >
          {"Chart Title"}
        </ItemHeaderTitle>
        <Segmented
          items={["1D", "1W", "1M", "3M", "1Y"]}
          inputValue={timeFrame}
          onChange={(inputValue) => {
            setTimeFrame(inputValue);
          }}
          size={"sm"}
        />
      </ItemHeaderContainer>

      <Chart.Root maxH="md" chart={chart}>
        <LineChart data={chart.data} margin={{ left: 40, right: 40, top: 40 }}>
          <CartesianGrid
            stroke={chart.color("border")}
            strokeDasharray="3 3"
            horizontal={false}
          />
          <XAxis
            dataKey={chart.key("month")}
            tickFormatter={(value) => value.slice(0, 3)}
            stroke={chart.color("border")}
          />
          <Tooltip
            animationDuration={100}
            cursor={{ stroke: chart.color("border") }}
            content={<Chart.Tooltip />}
          />
          <Line
            isAnimationActive={false}
            dataKey={chart.key("budget")}
            fill={chart.color(themeConfig.primaryColorHex)}
            stroke={chart.color(themeConfig.primaryColorHex)}
            strokeWidth={2}
          >
            <LabelList
              dataKey={chart.key("budget")}
              position="right"
              offset={10}
              style={{
                fontWeight: "600",
                fill: chart.color("fg"),
              }}
            />
          </Line>
        </LineChart>
      </Chart.Root>
    </ItemContainer>
  );
};

export default function Page() {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const dimension = useContainerDimension(containerRef);

  // States
  const isValidDimension = isDimensionValid(dimension);
  const isSmContainer = dimension.width < 600;
  const [filter, setFilter] = useState<any>(DEFAULT_FILTER);
  const data = {
    "1D": [
      { value: 12, month: "January" },
      { value: 78, month: "February" },
      { value: 101, month: "March" },
      { value: 56, month: "April" },
      { value: 92, month: "May" },
      { value: 44, month: "June" },
      { value: 73, month: "July" },
      { value: 119, month: "August" },
      { value: 67, month: "September" },
      { value: 88, month: "October" },
      { value: 52, month: "November" },
      { value: 110, month: "December" },
    ],
    "1W": [
      { value: 25, month: "January" },
      { value: 95, month: "February" },
      { value: 84, month: "March" },
      { value: 70, month: "April" },
      { value: 40, month: "May" },
      { value: 65, month: "June" },
      { value: 130, month: "July" },
      { value: 102, month: "August" },
      { value: 89, month: "September" },
      { value: 118, month: "October" },
      { value: 55, month: "November" },
      { value: 97, month: "December" },
    ],
    "1M": [
      { value: 40, month: "January" },
      { value: 110, month: "February" },
      { value: 78, month: "March" },
      { value: 115, month: "April" },
      { value: 66, month: "May" },
      { value: 90, month: "June" },
      { value: 105, month: "July" },
      { value: 122, month: "August" },
      { value: 70, month: "September" },
      { value: 135, month: "October" },
      { value: 82, month: "November" },
      { value: 120, month: "December" },
    ],
    "3M": [
      { value: 55, month: "January" },
      { value: 125, month: "February" },
      { value: 60, month: "March" },
      { value: 96, month: "April" },
      { value: 130, month: "May" },
      { value: 72, month: "June" },
      { value: 88, month: "July" },
      { value: 148, month: "August" },
      { value: 94, month: "September" },
      { value: 160, month: "October" },
      { value: 75, month: "November" },
      { value: 140, month: "December" },
    ],
    "1Y": [
      { value: 70, month: "January" },
      { value: 140, month: "February" },
      { value: 90, month: "March" },
      { value: 160, month: "April" },
      { value: 100, month: "May" },
      { value: 85, month: "June" },
      { value: 175, month: "July" },
      { value: 155, month: "August" },
      { value: 120, month: "September" },
      { value: 180, month: "October" },
      { value: 98, month: "November" },
      { value: 165, month: "December" },
    ],
  };

  return (
    <PageContainer ref={containerRef}>
      <PageTitle justify={"space-between"} pr={3}>
        <HStack>
          {!isSmContainer && (
            <DataUtils filter={filter} setFilter={setFilter} />
          )}
        </HStack>
      </PageTitle>

      {isValidDimension && (
        <PageContent>
          {isSmContainer && (
            <HScroll px={3} flexShrink={0}>
              <DataUtils filter={filter} setFilter={setFilter} w={"max"} />
            </HScroll>
          )}

          <SimpleGrid
            w={"full"}
            columns={isSmContainer ? 2 : 4}
            gap={isSmContainer ? 2 : 3}
            px={3}
            pos={"relative"}
          >
            {Array.from({ length: 4 }).map((_, idx) => {
              return <OverviewItem key={idx} />;
            })}
          </SimpleGrid>

          <SimpleGrid columns={[1, null, 2]} p={3} gap={3}>
            <Chart1 data={data} />

            <Chart1 data={data} />
          </SimpleGrid>
        </PageContent>
      )}
    </PageContainer>
  );
}
