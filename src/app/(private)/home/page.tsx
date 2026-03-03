"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { DateRangePickerInput } from "@/components/ui/date-range-picker-input";
import { P } from "@/components/ui/p";
import { Segmented } from "@/components/ui/segment-group";
import { Switch } from "@/components/ui/switch";
import { ClampText } from "@/components/widget/ClampText";
import { HScroll } from "@/components/widget/HScroll";
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
} from "@/components/widget/PageShell";
import { dummyChartData } from "@/constants/dummyData";
import { getMonthNames } from "@/constants/months";
import { Type__ChartData } from "@/constants/types";
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
  Label,
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
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      p={4}
      pt={3}
      border={"1px solid"}
      borderColor={"border.muted"}
      rounded={themeConfig.radii.component}
      bg={"body"}
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
  const ZOOM_STEP = 5;
  const ZOOM_PIXEL_THRESHOLD = 20;

  // Props
  const { data, year, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Refs
  const isPanningRef = useRef<boolean>(false);
  const activePointerTypeRef = useRef<"mouse" | "touch" | "pen" | null>(null);
  const panStartXRef = useRef<number>(0);
  const panStartYRef = useRef<number>(0);
  const offsetStartRef = useRef<number>(0);
  const zoomWindowStartRef = useRef<number>(0);
  const pinchStartDistanceRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(0);

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
    Math.min(offset, rawData.length - zoomWindow),
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
        const monthNames = getMonthNames(l);

        if (timeFrame === "3M") {
          const slice = monthNames.slice(
            absoluteIndex * 3,
            absoluteIndex * 3 + 3,
          );

          return `${slice[0].slice(0, 3)} - ${slice[slice.length - 1].slice(
            0,
            3,
          )}`;
        }

        if (timeFrame === "1M") return monthNames[absoluteIndex];
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
  function applyZoom(nextZoom: number) {
    setZoomWindow(Math.min(MAX_WINDOW, Math.max(MIN_WINDOW, nextZoom)));
  }
  function computeZoomFromDrag(startZoom: number, deltaY: number) {
    const steps = Math.floor(deltaY / ZOOM_PIXEL_THRESHOLD);
    return startZoom - steps * ZOOM_STEP;
  }
  function computeZoomFromPinch(
    startZoom: number,
    startDist: number,
    currentDist: number,
  ) {
    const delta = startDist - currentDist;
    const steps = Math.floor(delta / ZOOM_PIXEL_THRESHOLD);
    return startZoom + steps * ZOOM_STEP;
  }
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    activePointerTypeRef.current = e.pointerType;
    isPanningRef.current = true;

    panStartXRef.current = e.clientX;
    panStartYRef.current = e.clientY;
    offsetStartRef.current = offset;
    zoomWindowStartRef.current = zoomWindow;
  }
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!isPanningRef.current) return;
    if (activePointerTypeRef.current === "touch") return;

    const deltaX = e.clientX - panStartXRef.current;
    const deltaY = e.clientY - panStartYRef.current;

    const panSensitivity = Math.max(1, zoomWindow / 20);
    const deltaOffset = Math.round(deltaX / panSensitivity);
    const nextOffset = offsetStartRef.current - deltaOffset;

    if (nextOffset >= 0) {
      setOffset(nextOffset);
    }

    applyZoom(computeZoomFromDrag(zoomWindowStartRef.current, deltaY));
  }
  function stopPan() {
    isPanningRef.current = false;
    activePointerTypeRef.current = null;
  }
  function getTouchDistance(touches: React.TouchList) {
    const a = touches[0];
    const b = touches[1];
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    if (e.touches.length !== 2) return;

    pinchStartDistanceRef.current = getTouchDistance(e.touches);
    pinchStartZoomRef.current = zoomWindow;
  }
  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (e.touches.length !== 2) return;
    if (pinchStartDistanceRef.current === null) return;

    e.preventDefault();

    applyZoom(
      computeZoomFromPinch(
        pinchStartZoomRef.current,
        pinchStartDistanceRef.current,
        getTouchDistance(e.touches),
      ),
    );
  }
  function handleTouchEnd() {
    pinchStartDistanceRef.current = null;
  }

  return (
    <ItemContainer borderColor={"border.muted"} {...restProps}>
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
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopPan}
          onPointerLeave={stopPan}
          onPointerCancel={stopPan}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
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
              >
                <Label
                  value={capitalizeWords(l.yearly_sales)}
                  angle={-90}
                  position="insideLeft"
                  textAnchor="middle"
                  dx={-16}
                />
              </YAxis>

              <Tooltip
                animationDuration={100}
                cursor={{ stroke: chart.color("border") }}
                content={<Chart.Tooltip />}
              />

              {chart.series.map((item) => {
                const isActive = highlights.includes(
                  parseInt(item.name as string),
                );

                return (
                  isActive && (
                    <Line
                      key={item.name}
                      dot={false}
                      animationDuration={200}
                      dataKey={chart.key(item.name)}
                      stroke={chart.color(item.color)}
                      opacity={isActive ? 1 : 0.08}
                    >
                      {isActive && showPointLabel && (
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
                  )
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

          <HStack gap={1}>
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
                        : [...prev, year],
                    )
                  }
                  size={"xs"}
                  variant={"ghost"}
                  color={isActive ? "" : "fg.subtle"}
                >
                  <DotIndicator color={isActive ? s.color : "d2"} mr={1} />
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
            <HScroll px={3} flexShrink={0} mb={3}>
              <DataUtils filter={filter} setFilter={setFilter} w={"max"} />
            </HScroll>
          )}

          <CContainer>
            <SimpleGrid
              w={"full"}
              columns={isSmContainer ? 2 : 4}
              gap={3}
              px={3}
              pos={"relative"}
            >
              {Array.from({ length: 4 }).map((_, idx) => {
                return <OverviewItem key={idx} />;
              })}
            </SimpleGrid>

            <SimpleGrid columns={isSmContainer ? 1 : 2} p={3} gap={3}>
              <Chart1 data={data} year={filter.year} />

              <Chart1 data={data} year={filter.year} />
            </SimpleGrid>
          </CContainer>
        </PageContent>
      )}
    </PageContainer>
  );
}
