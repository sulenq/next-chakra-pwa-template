"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Segmented } from "@/components/ui/segment-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { AppIcon } from "@/components/widget/AppIcon";
import { ClampText } from "@/components/widget/ClampText";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import {
  PageContainer,
  PageContent,
  usePageContainerContext,
} from "@/components/widget/PageShell";
import { DUMMY_DASHBOARD_DATA } from "@/constants/dummyData";
import { getMonthNames } from "@/constants/months";
import { Type__ChartData } from "@/constants/types";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useDataState from "@/hooks/useDataState";
import { formatDuration, formatNumber } from "@/utils/formatter";
import { isObjectDeepEmpty } from "@/utils/object";
import { capitalizeWords } from "@/utils/string";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Badge,
  HStack,
  SimpleGrid,
  SimpleGridProps,
  StackProps,
} from "@chakra-ui/react";
import {
  ArrowUpIcon,
  CheckCheckIcon,
  ClockFadingIcon,
  FilesIcon,
  GitCompareIcon,
  MessageCircleIcon,
  UsersIcon,
} from "lucide-react";
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

interface OverviewItemProps extends StackProps {
  item: {
    icon?: any;
    title: string;
    description: string;
    value: number;
  };
  index?: number;
}
const OverviewItem = (props: OverviewItemProps) => {
  // Props
  const { item, ...restProps } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      gap={1}
      p={4}
      border={"1px solid"}
      borderColor={"border.muted"}
      rounded={themeConfig.radii.component}
      // bg={"item"}
      {...restProps}
    >
      <HStack gap={1}>
        <ItemHeaderTitle
          autoHeight
          color={"fg.muted"}
          popoverContent={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit."
          }
        >
          {"Chart Title"}
        </ItemHeaderTitle>

        <AppIcon icon={item.icon} boxSize={6} ml={"auto"} />
      </HStack>

      <P fontSize={"2xl"} fontWeight={"medium"}>
        {item.value}
      </P>

      <HStack mt={2}>
        <Badge w={"fit"} colorPalette={"green"}>
          <AppIcon icon={ArrowUpIcon} boxSize={3} />
          12.5%
        </Badge>

        <ClampText fontSize={"sm"} color={"fg.subtle"}>
          since last month
        </ClampText>
      </HStack>
    </CContainer>
  );
};

interface OverviewProps extends SimpleGridProps {
  data: any;
}
const Overview = (props: OverviewProps) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { l } = useLang();
  const { isSmContainer } = usePageContainerContext();

  // States
  const resolvedData = [
    {
      icon: UsersIcon,
      title: l.total_users.title,
      description: l.total_users.description,
      value: formatNumber(data.totalUsers),
    },
    {
      icon: FilesIcon,
      title: l.total_document.title,
      description: l.total_document.description,
      value: formatNumber(data.totalDocument),
    },
    {
      icon: MessageCircleIcon,
      title: l.total_query_this_day.title,
      description: l.total_query_this_day.description,
      value: formatNumber(data.totalQueryThisDay),
    },
    {
      icon: GitCompareIcon,
      title: l.total_document_compared.title,
      description: l.total_document_compared.description,
      value: formatNumber(data.totalDOcumentCompared),
    },
    {
      icon: CheckCheckIcon,
      title: l.answer_success_rate.title,
      description: l.answer_success_rate.description,
      value: `${data.AnswerSuccessRate}%`,
    },
    {
      icon: ClockFadingIcon,
      title: l.avg_response_time.title,
      description: l.avg_response_time.description,
      value: formatDuration(data.AvgResponseTime),
    },
  ];

  return (
    <CContainer px={4}>
      <HStack minH={"36px"} mt={2} mb={3}>
        <P fontSize={"xl"} fontWeight={"semibold"}>
          Overview
        </P>
      </HStack>

      <SimpleGrid
        columns={isSmContainer ? 2 : 3}
        gap={3}
        pos={"relative"}
        {...restProps}
      >
        {resolvedData?.map((item: any, index: number) => {
          return <OverviewItem key={index} item={item} index={index} />;
        })}
      </SimpleGrid>
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
        <ItemHeaderTitle
          color={"fg.muted"}
          popoverContent={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit."
          }
        >
          {"Chart Title"}
        </ItemHeaderTitle>

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

const Usage = (props: any) => {
  // Props
  const { data, filter, ...restProps } = props;

  // Contexts
  const { isSmContainer } = usePageContainerContext();

  return (
    <CContainer px={4}>
      <HStack minH={"36px"} mt={2} mb={3}>
        <P fontSize={"xl"} fontWeight={"semibold"}>
          Usage
        </P>
      </HStack>

      <SimpleGrid columns={isSmContainer ? 1 : 2} gap={3} {...restProps}>
        <Chart1 data={data} year={filter.year} />

        <Chart1 data={data} year={filter.year} />
      </SimpleGrid>
    </CContainer>
  );
};

const PageScreen = () => {
  // States
  const [filter] = useState<any>(DEFAULT_FILTER);
  const { initialLoading, error, data, onRetry } = useDataState<any>({
    initialData: DUMMY_DASHBOARD_DATA,
    // url: ``,
    dataResource: false,
  });
  const render = {
    loading: <Skeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: data && (
      <>
        <CContainer gap={4}>
          <Overview data={data.overview} />

          <Usage data={data.usage} filter={filter} />
        </CContainer>
      </>
    ),
  };

  return (
    <PageContent>
      {initialLoading && render.loading}
      {!initialLoading && (
        <>
          {error && render.error}
          {!error && (
            <>
              {isObjectDeepEmpty(data) && render.empty}
              {!isObjectDeepEmpty(data) && render.loaded}
            </>
          )}
        </>
      )}
    </PageContent>
  );
};
export default function Page() {
  return (
    <PageContainer>
      <PageScreen />
    </PageContainer>
  );
}
