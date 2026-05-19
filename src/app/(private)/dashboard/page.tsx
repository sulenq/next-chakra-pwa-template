"use client";

import { Btn } from "@/components/ui/btn";
import { P } from "@/components/ui/p";
import { Segmented } from "@/components/ui/segment-group";
import { Skeleton } from "@/components/ui/skeleton";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { AppIconLucide } from "@/components/branding/app-icon";
import { ChartTooltip } from "@/components/overlays/chart-tooltip";
import { ClampText } from "@/components/ui/clamp-text";
import FeedbackNoData from "@/components/feedback/feedback-no-data";
import FeedbackRetry from "@/components/feedback/feedback-retry";
import { DotIndicator } from "@/components/ui/indicator";
import { Item } from "@/components/container/item";
import { MainView, useMainViewContext } from "@/components/container/main-view";
import { DUMMY_DASHBOARD_DATA } from "@/constants/dummy-data";
import { getMonthNames } from "@/constants/months";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { useFetchData } from "@/hooks/useFetchData";
import { ChartData } from "@/types/global.types";
import { getUserData } from "@/utils/auth";
import { formatDuration, formatNumber } from "@/utils/formatter";
import { isObjectDeepEmpty } from "@/utils/object";
import { capitalizeWords, interpolateString } from "@/utils/string";
import { Chart, useChart } from "@chakra-ui/charts";
import {
  Badge,
  Center,
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
  const { themeContext } = useThemeContext();

  return (
    <Item.Body gap={1} {...restProps}>
      <StackH align={"center"} gap={1} p={2} pl={4}>
        <Item.Title
          autoHeight
          popoverContent={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit."
          }
        >
          {"Chart Title"}
        </Item.Title>

        <Center
          p={2}
          bg={"bg.subtle"}
          rounded={themeContext.radii.component}
          ml={"auto"}
        >
          <AppIconLucide icon={item.icon} boxSize={5} />
        </Center>
      </StackH>

      <StackV p={4} pt={0}>
        <P fontSize={"2xl"} fontWeight={"medium"}>
          {`${item.value}`}
        </P>

        <StackH align={"center"} mt={2}>
          <Badge w={"fit"} colorPalette={"green"}>
            <AppIconLucide icon={ArrowUpIcon} boxSize={3} />
            12.5%
          </Badge>

          <ClampText fontSize={"sm"} color={"fg.subtle"}>
            since last month
          </ClampText>
        </StackH>
      </StackV>
    </Item.Body>
  );
};

interface OverviewProps extends SimpleGridProps {
  data: any;
}
const Overview = (props: OverviewProps) => {
  // Props
  const { data, ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();
  const { isSmContainer } = useMainViewContext();

  // States
  const resolvedData = [
    {
      icon: UsersIcon,
      title: t.total_users.title,
      description: t.total_users.description,
      value: formatNumber(data.totalUsers),
    },
    {
      icon: FilesIcon,
      title: t.total_document.title,
      description: t.total_document.description,
      value: formatNumber(data.totalDocument),
    },
    {
      icon: MessageCircleIcon,
      title: t.total_query_this_day.title,
      description: t.total_query_this_day.description,
      value: formatNumber(data.totalQueryThisDay),
    },
    {
      icon: GitCompareIcon,
      title: t.total_document_compared.title,
      description: t.total_document_compared.description,
      value: formatNumber(data.totalDOcumentCompared),
    },
    {
      icon: CheckCheckIcon,
      title: t.answer_success_rate.title,
      description: t.answer_success_rate.description,
      value: `${data.AnswerSuccessRate}%`,
    },
    {
      icon: ClockFadingIcon,
      title: t.avg_response_time.title,
      description: t.avg_response_time.description,
      value: formatDuration(data.AvgResponseTime, t),
    },
  ];

  return (
    <StackV>
      <SimpleGrid
        columns={isSmContainer ? 2 : 3}
        gap={GAP}
        pos={"relative"}
        {...restProps}
      >
        {resolvedData?.map((item: any, index: number) => {
          return <OverviewItem key={index} item={item} index={index} />;
        })}
      </SimpleGrid>
    </StackV>
  );
};

const Chart1 = (props: any) => {
  const ZOOM_STEP = 5;
  const ZOOM_PIXEL_THRESHOLD = 20;

  // Props
  const { data, year, ...restProps } = props;

  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();

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
  const chart = useChart<ChartData>({
    data: visibleData.map((item: any, index: number) => {
      const absoluteIndex = clampedOffset + index;

      const getXAxisLabel = () => {
        const monthNames = getMonthNames(t);

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
      .map((y, index) => ({
        name: String(y),
        color:
          ["teal.solid", "purple.solid", "blue.solid"][index] ?? "gray.solid",
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
    <Item.Body {...restProps}>
      <Item.Header borderless>
        <Item.Title
          color={"fg.muted"}
          popoverContent={
            "Lorem ipsum dolor sit amet consectetur adipisicing elit."
          }
        >
          {"Chart Title"}
        </Item.Title>

        <Segmented
          items={["1D", "1W", "1M", "3M"]}
          inputValue={timeFrame}
          onChange={setTimeFrame}
          size={"xs"}
          mr={-2}
        />
      </Item.Header>

      <StackV>
        <StackV
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopPan}
          onPointerLeave={stopPan}
          onPointerCancel={stopPan}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          userSelect={"none"}
          overflow={"visible"}
        >
          <Chart.Root maxH={"md"} chart={chart} cursor={"grab !important"}>
            <LineChart
              data={chart.data}
              margin={{ left: 40, right: 40, top: 40 }}
            >
              <CartesianGrid
                stroke={chart.color("border")}
                strokeDasharray={"4 4"}
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
                  value={capitalizeWords(t.yearly_sales)}
                  angle={-90}
                  position={"insideLeft"}
                  textAnchor={"middle"}
                  dx={-16}
                />
              </YAxis>

              <Tooltip
                animationDuration={100}
                cursor={{ stroke: chart.color("border") }}
                content={ChartTooltip}
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
                          position={"right"}
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
        </StackV>

        <StackH
          align={"center"}
          justify={"space-between"}
          wrap={"wrap"}
          px={2}
          my={2}
        >
          <Switch
            checked={showPointLabel}
            onCheckedChange={(e) => setShowPointLabel(e.checked)}
            colorPalette={themeContext.colorPalette}
            ml={2}
          >
            Point label
          </Switch>

          <StackH align={"center"} gap={1}>
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
                  <DotIndicator
                    bg={isActive ? s.color : "bg.emphasized"}
                    mr={1}
                  />

                  {year}
                </Btn>
              );
            })}
          </StackH>
        </StackH>
      </StackV>
    </Item.Body>
  );
};

const Usage = (props: any) => {
  // Props
  const { data, filter, ...restProps } = props;

  // Contexts
  const { isSmContainer } = useMainViewContext();

  return (
    <StackV>
      <SimpleGrid columns={isSmContainer ? 1 : 2} gap={GAP} {...restProps}>
        <Chart1 data={data} year={filter.year} />

        <Chart1 data={data} year={filter.year} />
      </SimpleGrid>
    </StackV>
  );
};

export default function Page() {
  // Contexts
  const { t } = useLocaleContext();

  // States
  const [filter] = useState<any>(DEFAULT_FILTER);
  const { initialLoading, error, data, onRetry } = useFetchData<any>({
    initialData: DUMMY_DASHBOARD_DATA,
    // url: ``,
    dataResource: false,
  });

  // Constants
  const user = getUserData();

  // Render State Map
  const render = {
    loading: <Skeleton />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    loaded: data && (
      <StackV gap={GAP}>
        <Overview data={data.overview} />

        <Usage data={data.usage} filter={filter} />
      </StackV>
    ),
  };

  return (
    <MainView.Content gap={GAP} p={GAP}>
      <StackH
        wrap={"wrap"}
        align={"center"}
        justify={"space-between"}
        p={R_SPACING_MD}
        mb={4}
      >
        <StackV>
          <P
            fontSize={"3xl"}
            fontWeight={"medium"}
          >{`${t.hi}, ${user?.name || "User's Name"} 👋`}</P>

          <P>
            {user?.taskCount
              ? interpolateString(t.msg_task_count, {
                  count: user?.taskCount,
                })
              : t.msg_no_task}
          </P>
        </StackV>
      </StackH>

      <StackV>
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
      </StackV>
    </MainView.Content>
  );
}
