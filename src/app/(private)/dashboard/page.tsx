"use client";

import { Btn } from "@/components/ui/btn";
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
import { dummyChartData } from "@/constants/dummyData";
import { MONTHS } from "@/constants/months";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { formatNumber } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
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
  YAxis,
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
  const { l, lang } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const years = [year - 2, year - 1, year];
  const [timeFrame, setTimeFrame] = useState<string>("1D");
  const [showPointLabel, setShowPointLabel] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<number[]>(years);
  const highestPeriod = (() => {
    const totals = years.map((y) => {
      const sum = data?.[timeFrame]
        ?.map((item: any) => item[y])
        .filter((v: any) => typeof v === "number")
        .reduce((a: any, b: any) => a + b, 0);

      return { year: y, sum: sum ?? -Infinity };
    });

    const best = totals.reduce((a, b) => (b.sum > a.sum ? b : a));
    return best.year;
  })();
  const chart = useChart({
    data: data?.[timeFrame]?.map((item: any, idx: number) => {
      const getXAxisLabel = () => {
        if (timeFrame === "3M") {
          const slice = MONTHS[lang].slice(idx * 3, idx * 3 + 3);
          return `${slice[0].slice(0, 3)} - ${slice[slice.length - 1].slice(
            0,
            3
          )}`;
        }

        if (timeFrame === "1M") {
          return MONTHS[lang][idx];
        }

        if (timeFrame === "1W") {
          return `W${idx + 1}`;
        }

        return `D${idx + 1}`;
      };

      return {
        ...(item[year - 2] !== undefined && { [year - 2]: item[year - 2] }),
        ...(item[year - 1] !== undefined && { [year - 1]: item[year - 1] }),
        ...(item[year] !== undefined && { [year]: item[year] }),
        [timeFrame]: getXAxisLabel(),
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
          items={["1D", "1W", "1M", "3M"]}
          inputValue={timeFrame}
          onChange={(inputValue) => {
            setTimeFrame(inputValue);
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
              dataKey={chart.key(timeFrame)}
              stroke={chart.color("border")}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              dataKey={highestPeriod}
              stroke={chart.color("border")}
              label={{
                value: capitalizeWords(l.yearly_sales),
                position: "left",
                angle: -90,
              }}
            />
            <Tooltip
              animationDuration={100}
              cursor={{ stroke: chart.color("border") }}
              content={<Chart.Tooltip />}
            />
            {chart.series.map((item) => {
              const isHighlighted = highlights.includes(
                parseInt(item.name as string)
              );

              return (
                <Line
                  key={item.name}
                  dot={false}
                  animationDuration={200}
                  dataKey={chart.key(item.name)}
                  stroke={chart.color(item.color)}
                  opacity={isHighlighted ? 1 : 0.08}
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

          <HStack>
            {years.map((year) => {
              const isActive = highlights.includes(year);

              return (
                <Btn
                  key={year}
                  onClick={() => {
                    const isHighlighted = highlights.includes(year);
                    if (isHighlighted) {
                      setHighlights(highlights.filter((y) => y !== year));
                      return;
                    } else {
                      setHighlights([...highlights, year]);
                    }
                  }}
                  size={"xs"}
                  variant={isActive ? "subtle" : "outline"}
                  color={isActive ? "" : "fg.subtle"}
                >
                  {year}
                </Btn>
              );
            })}
          </HStack>
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
  const data = dummyChartData;

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
