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
import { DotIndicator } from "@/components/widget/Indicator";
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
import { Type__ChartData } from "@/constants/types";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { formatNumber } from "@/utils/formatter";
import { capitalizeWords } from "@/utils/string";
import { isDimensionValid } from "@/utils/style";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Badge,
  Group,
  HStack,
  Icon,
  SimpleGrid,
  StackProps,
} from "@chakra-ui/react";
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

  // Refs
  const isPanningRef = useRef<boolean>(false);
  const panStartXRef = useRef<number>(0);
  const offsetStartRef = useRef<number>(0);

  // States
  const years = [year - 2, year - 1, year];
  const [timeFrame, setTimeFrame] = useState<string>("1D");
  const [showPointLabel, setShowPointLabel] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<number[]>(years);
  const rawData: any[] = data?.[timeFrame] ?? [];
  const MIN_WINDOW = 5;
  const MAX_WINDOW = rawData.length;
  const [zoomWindow, setZoomWindow] = useState<number>(rawData.length);
  const [offset, setOffset] = useState<number>(0);
  const clampedOffset = Math.max(
    0,
    Math.min(offset, rawData.length - zoomWindow)
  );
  const visibleData = rawData.slice(clampedOffset, clampedOffset + zoomWindow);
  const highestPeriod = (() => {
    const totals = years.map((y) => {
      const sum = visibleData
        .map((item: any) => item[y])
        .filter((v: any) => typeof v === "number")
        .reduce((a: number, b: number) => a + b, 0);

      return { year: y, sum: sum ?? -Infinity };
    });

    return totals.reduce((a, b) => (b.sum > a.sum ? b : a)).year;
  })();
  const chart = useChart<Type__ChartData>({
    data: visibleData.map((item: any, idx: number) => {
      const absoluteIndex = clampedOffset + idx;
      const getXAxisLabel = () => {
        if (timeFrame === "3M") {
          const slice = MONTHS[lang].slice(
            absoluteIndex * 3,
            absoluteIndex * 3 + 3
          );
          return `${slice[0].slice(0, 3)} - ${slice[slice.length - 1].slice(
            0,
            3
          )}`;
        }

        if (timeFrame === "1M") return MONTHS[lang][absoluteIndex];
        if (timeFrame === "1W") return `W${absoluteIndex + 1}`;
        return `D${absoluteIndex + 1}`;
      };

      return {
        ...(item[year - 2] !== undefined && { [year - 2]: item[year - 2] }),
        ...(item[year - 1] !== undefined && { [year - 1]: item[year - 1] }),
        ...(item[year] !== undefined && { [year]: item[year] }),
        [timeFrame]: getXAxisLabel(),
      };
    }),
    series: years
      .filter((y) => visibleData.some((item: any) => item[y] !== undefined))
      .map((y, idx) => ({
        name: String(y),
        color:
          ["teal.solid", "purple.solid", "blue.solid"][idx] ?? "gray.solid",
      })),
  });

  // Utils
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();

    setZoomWindow((prev) => {
      const next =
        e.deltaY < 0
          ? Math.max(MIN_WINDOW, prev - 1)
          : Math.min(MAX_WINDOW, prev + 1);

      return next;
    });
  };
  const stopPan = () => {
    isPanningRef.current = false;
  };

  return (
    <ItemContainer {...restProps}>
      <ItemHeaderContainer borderless withUtils>
        <ItemHeaderTitle color={"fg.muted"}>{"Chart Title"}</ItemHeaderTitle>

        <Segmented
          items={["1D", "1W", "1M", "3M"]}
          inputValue={timeFrame}
          onChange={setTimeFrame}
          size={"xs"}
          mr={2}
        />
      </ItemHeaderContainer>

      <CContainer>
        <CContainer
          onWheel={handleWheel}
          onPointerDown={(e) => {
            if (e.pointerType === "touch") e.preventDefault();

            isPanningRef.current = true;
            panStartXRef.current = e.clientX;
            offsetStartRef.current = offset;
          }}
          onPointerMove={(e) => {
            if (!isPanningRef.current) return;

            const deltaX = e.clientX - panStartXRef.current;
            const sensitivity = Math.max(1, zoomWindow / 20);
            const deltaOffset = Math.round(deltaX / sensitivity);
            const resolvedOffset = offsetStartRef.current - deltaOffset;
            if (resolvedOffset > 0)
              setOffset(offsetStartRef.current - deltaOffset);
          }}
          onPointerUp={stopPan}
          onPointerCancel={stopPan}
          cursor={"grab !important"}
          userSelect={"none"}
        >
          <Chart.Root maxH="md" chart={chart} cursor={"grab !important"}>
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
                tickFormatter={
                  timeFrame === "1M" ? (value) => value.slice(0, 3) : undefined
                }
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
        </CContainer>

        <HStack wrap={"wrap"} justify={"space-between"} px={2} my={2}>
          <Switch
            checked={showPointLabel}
            onCheckedChange={(e) => setShowPointLabel(e.checked)}
            colorPalette={themeConfig.colorPalette}
            ml={2}
          >
            Point label
          </Switch>

          <Group attached>
            {chart.series.map((s) => {
              const year = parseInt(s.name as string);
              const isActive = highlights.includes(year);

              return (
                <Btn
                  key={s.name}
                  clicky={false}
                  onClick={() =>
                    setHighlights((prev) =>
                      prev.includes(year)
                        ? prev.filter((v) => v !== year)
                        : [...prev, year]
                    )
                  }
                  size={"xs"}
                  variant={isActive ? "outline" : "outline"}
                  color={isActive ? "" : "fg.subtle"}
                >
                  <DotIndicator color={isActive ? s.color : "d2"} mr={1} />

                  {year}
                </Btn>
              );
            })}
          </Group>
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
