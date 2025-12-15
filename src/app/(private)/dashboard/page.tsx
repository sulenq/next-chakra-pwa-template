"use client";

import { CContainer } from "@/components/ui/c-container";
import { DateRangePickerInput } from "@/components/ui/date-range-picker-input";
import { P } from "@/components/ui/p";
import { Segmented } from "@/components/ui/segment-group";
import { Switch } from "@/components/ui/switch";
import { ClampText } from "@/components/widget/ClampText";
import HScroll from "@/components/widget/HScroll";
import { LucideIcon } from "@/components/widget/Icon";
import { InfoPopover } from "@/components/widget/InfoPopover";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import {
  PageContainer,
  PageContent,
  PageTitle,
} from "@/components/widget/Page";
import { MONTHS } from "@/constants/months";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { formatNumber } from "@/utils/formatter";
import { isDimensionValid } from "@/utils/style";
import { Chart, useChart } from "@chakra-ui/charts";
import { Badge, HStack, Icon, SimpleGrid, StackProps } from "@chakra-ui/react";
import { ArrowUpIcon } from "lucide-react";
import { useRef, useState } from "react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Tooltip,
  XAxis,
} from "recharts";

const DEFAULT_FILTER = {
  startDate: null,
  endDate: null,
  year: new Date().getFullYear(),
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
          Title Here
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
  const { data, year, ...restProps } = props;

  // Contexts
  const { lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [timeFrame, setTimeFrame] = useState<string>("1D");
  const [showPointLabel, setShowPointLabel] = useState<boolean>(false);
  const [highlight, setHighlight] = useState<string>(`${year}`);
  const years = [year - 2, year - 1, year];
  // const highestPeriod = (() => {
  //   const totals = years.map((y) => {
  //     const sum = data?.[timeFrame]
  //       ?.map((item: any) => item[y])
  //       .filter((v: any) => typeof v === "number")
  //       .reduce((a: any, b: any) => a + b, 0);

  //     return { year: y, sum: sum ?? -Infinity };
  //   });

  //   const best = totals.reduce((a, b) => (b.sum > a.sum ? b : a));
  //   return best.year;
  // })();
  const chart = useChart({
    data: data?.[timeFrame]?.map((item: any, idx: number) => {
      return {
        ...(item[year - 2] !== undefined && { [year - 2]: item[year - 2] }),
        ...(item[year - 1] !== undefined && { [year - 1]: item[year - 1] }),
        ...(item[year] !== undefined && { [year]: item[year] }),
        months: MONTHS[lang][idx],
        monthsNumber: Array.from({ length: 12 }, (_, i) => i + 1)[idx],
      };
    }),

    series: years
      .filter((year) => {
        return data?.[timeFrame]?.some((item: any) => item[year] !== undefined);
      })
      .map((year, yidx) => {
        return {
          name: String(year),
          color:
            ["teal.solid", "purple.solid", "blue.solid"][yidx] ?? "gray.solid",
        };
      }),
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
          w={"fit"}
          items={years.map((y) => {
            return `${y}`;
          })}
          inputValue={highlight}
          onChange={(inputValue) => {
            setHighlight(inputValue);
          }}
          size={"xs"}
          mr={2}
        />
      </ItemHeaderContainer>

      <CContainer>
        <Chart.Root maxH="md" chart={chart}>
          <LineChart
            data={chart.data}
            margin={{ left: 40, right: 40, top: 40 }}
          >
            <CartesianGrid
              stroke={chart.color("border")}
              strokeDasharray="4 4"
              horizontal={false}
            />
            <XAxis
              dataKey={chart.key("months")}
              stroke={chart.color("border")}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            {/* <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            dataKey={highestPeriod}
            stroke={chart.color("border")}
          /> */}
            <Tooltip
              animationDuration={100}
              cursor={{ stroke: chart.color("border") }}
              content={<Chart.Tooltip />}
            />
            {chart.series.map((item, idx) => {
              const isHighlighted = item.name === highlight;

              return (
                <Line
                  key={item.name}
                  isAnimationActive={false}
                  dataKey={chart.key(item.name)}
                  fill={chart.color(item.color)}
                  stroke={themeConfig.primaryColorHex}
                  // stroke={chart.color(item.color)}
                  opacity={isHighlighted ? 1 : 0.08}
                  strokeWidth={2}
                  zIndex={isHighlighted ? 3 : idx + 1}
                >
                  {isHighlighted && showPointLabel && (
                    <LabelList
                      dataKey={chart.key(item.name)}
                      position="right"
                      offset={10}
                      style={{
                        fontWeight: "600",
                        fill: chart.color("fg.subtle"),
                      }}
                    />
                  )}
                </Line>
              );
            })}
          </LineChart>
        </Chart.Root>

        <HStack wrap={"wrap"} justify={"space-between"} px={2} my={2}>
          <Switch
            checked={showPointLabel}
            onCheckedChange={(e) => setShowPointLabel(e.checked)}
            colorPalette={themeConfig.colorPalette}
            ml={2}
          >
            Point label
          </Switch>

          <Segmented
            items={["1D", "1W", "1M", "3M"]}
            inputValue={timeFrame}
            onChange={(inputValue) => {
              setTimeFrame(inputValue);
            }}
            size={"xs"}
          />
        </HStack>
      </CContainer>
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
      { 2023: 14, 2024: 38, 2025: 22, month: "January" },
      { 2023: 92, 2024: 41, 2025: 63, month: "February" },
      { 2023: 55, 2024: 19, 2025: 117, month: "March" },
      { 2023: 33, 2024: 72, 2025: 48, month: "April" },
      { 2023: 101, 2024: 97, 2025: 66, month: "May" },
      { 2023: 27, 2024: 43, 2025: 90, month: "June" },
      { 2023: 63, 2024: 12, 2025: 145, month: "July" },
      { 2023: 118, 2024: 58, 2025: 30, month: "August" },
      { 2023: 44, 2024: 122, 2025: 52, month: "September" },
      { 2023: 88, 2024: 77, 2025: 143, month: "October" },
      { 2023: 12, 2024: 55, 2025: 31, month: "November" },
      { 2023: 95, 2024: 14, 2025: 120, month: "December" },
    ],

    "1W": [
      { 2023: 45, 2024: 12, 2025: 77, month: "January" },
      { 2023: 73, 2024: 101, 2025: 18, month: "February" },
      { 2023: 26, 2024: 88, 2025: 130, month: "March" },
      { 2023: 140, 2024: 33, 2025: 51, month: "April" },
      { 2023: 57, 2024: 69, 2025: 95, month: "May" },
      { 2023: 108, 2024: 24, 2025: 63, month: "June" },
      { 2023: 35, 2024: 115, 2025: 20, month: "July" },
      { 2023: 120, 2024: 47, 2025: 99, month: "August" },
      { 2023: 49, 2024: 141, 2025: 74, month: "September" },
      { 2023: 88, 2024: 32, 2025: 138, month: "October" },
      { 2023: 16, 2024: 72, 2025: 45, month: "November" },
      { 2023: 134, 2024: 55, 2025: 112, month: "December" },
    ],

    "1M": [
      { 2023: 68, 2024: 91, 2025: 34, month: "January" },
      { 2023: 150, 2024: 30, 2025: 118, month: "February" },
      { 2023: 48, 2024: 122, 2025: 19, month: "March" },
      { 2023: 78, 2024: 66, 2025: 143, month: "April" },
      { 2023: 15, 2024: 95, 2025: 50, month: "May" },
      { 2023: 132, 2024: 57, 2025: 72, month: "June" },
      { 2023: 41, 2024: 140, 2025: 82, month: "July" },
      { 2023: 87, 2024: 38, 2025: 155, month: "August" },
      { 2023: 123, 2024: 20, 2025: 92, month: "September" },
      { 2023: 54, 2024: 160, 2025: 108, month: "October" },
      { 2023: 32, 2024: 75, 2025: 135, month: "November" },
      { 2023: 146, 2024: 112, 2025: 29, month: "December" },
    ],

    "3M": [
      { 2023: 22, 2024: 130, 2025: 91, month: "January" },
      { 2023: 175, 2024: 44, 2025: 88, month: "February" },
      { 2023: 69, 2024: 158, 2025: 30, month: "March" },
      { 2023: 128, 2024: 20, 2025: 155, month: "April" },
      { 2023: 47, 2024: 98, 2025: 62, month: "May" },
      { 2023: 105, 2024: 142, 2025: 18, month: "June" },
      { 2023: 33, 2024: 68, 2025: 121, month: "July" },
      { 2023: 160, 2024: 52, 2025: 147, month: "August" },
      { 2023: 88, 2024: 30, 2025: 174, month: "September" },
      { 2023: 140, 2024: 152, 2025: 55, month: "October" },
      { 2023: 12, 2024: 85, 2025: 102, month: "November" },
      { 2023: 115, 2024: 118, 2025: 66, month: "December" },
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
            <Chart1 data={data} year={filter.year} />

            <Chart1 data={data} year={filter.year} />
          </SimpleGrid>
        </PageContent>
      )}
    </PageContainer>
  );
}
