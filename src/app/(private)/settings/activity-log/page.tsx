"use client";

import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { StackV } from "@/components/ui/stack";
import { DataFooter } from "@/components/widgets/data-footer";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { LucideIcon } from "@/components/widgets/icon";
import { Item } from "@/components/widgets/item";
import { MiniUser } from "@/components/widgets/mini-user";
import { dummyAllActivityLogs } from "@/constants/dummyData";
import { ActivityActionEnum } from "@/constants/enums";
import { Interface__ActivityLog } from "@/constants/interfaces";
import { BASE_ICON_BOX_SIZE, R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useFetchData } from "@/hooks/useFetchData";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { HStack, Icon } from "@chakra-ui/react";
import { ActivityIcon } from "lucide-react";
import { useState } from "react";

const ActivityLog = () => {
  // Contexts
  const { t } = useLocale();

  // States
  const [search, setSearch] = useState("");
  const {
    error,
    initialLoading,
    data,
    onRetry,
    limit,
    setLimit,
    pagination,
    page,
    setPage,
  } = useFetchData<{
    totalData: number;
    items: Interface__ActivityLog[];
  }>({
    initialData: {
      totalData: 100,
      items: dummyAllActivityLogs,
    },
    url: ``,
    dataResource: false,
  });

  // Derived Values
  const activityFormatter: Record<
    string,
    (meta?: Record<string, any>) => string
  > = {
    // TODO_DEV create action sentence glosary
    [ActivityActionEnum.CREATE_WORKSPACE]: (meta) =>
      `Created workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [ActivityActionEnum.UPDATE_WORKSPACE]: (meta) =>
      `Updated workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [ActivityActionEnum.DELETE_WORKSPACE]: (meta) =>
      `Deleted workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [ActivityActionEnum.CREATE_LAYER]: (meta) =>
      `Created layer "${meta?.layerName ?? "Unknown"}"`,

    [ActivityActionEnum.UPDATE_LAYER]: (meta) =>
      `Updated layer "${meta?.layerName ?? "Unknown"}"`,

    [ActivityActionEnum.DELETE_LAYER]: (meta) =>
      `Deleted layer "${meta?.layerName ?? "Unknown"}`,
  };
  const formatActivityLog = (log: Interface__ActivityLog): string => {
    return activityFormatter[log.action as ActivityActionEnum](log.metadata);
  };

  // Render State Map
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        {data?.items?.map((log, idx) => {
          return (
            <HStack
              key={`${log.id}-${idx}`}
              gap={4}
              px={4}
              py={2}
              justify={"space-between"}
              borderTop={idx === 0 ? "" : "1px solid"}
              borderColor={"border.subtle"}
            >
              {log.user && <MiniUser withEmail user={log.user} w={"240px"} />}

              <StackV flex={1} w={"fit"}>
                <P>{formatActivityLog(log)}</P>

                <P color={"fg.subtle"}>
                  {formatDate(log?.createdAt, t, {
                    variant: "dayShortMonthYear",

                    withTime: true,
                  })}
                </P>
              </StackV>
            </HStack>
          );
        })}
      </>
    ),
  };

  return (
    <Item.Body borderless bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={ActivityIcon} />
          </Icon>
          <Item.Title>{t.activity_logs}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body>
          <StackV p={4}>
            <SearchInput
              onChange={(inputValue) => {
                setSearch(inputValue || "");
              }}
              inputValue={search}
              queryKey={"q-activity-auth"}
            />
          </StackV>

          <StackV minH={"300px"}>
            {initialLoading && render.loading}
            {!initialLoading && (
              <>
                {error && render.error}
                {!error && (
                  <>
                    {data?.items && render.loaded}
                    {(!data?.items || isEmptyArray(data?.items)) &&
                      render.empty}
                  </>
                )}
              </>
            )}
          </StackV>

          <DataFooter
            borderless
            limit={limit}
            setLimit={setLimit}
            dataLength={data?.items?.length}
            totalData={data?.totalData}
            page={page}
            setPage={setPage}
            totalPage={pagination?.meta?.totalPage}
          />
        </Item.Body>
      </StackV>
    </Item.Body>
  );
};

export default function Page() {
  return (
    <StackV flex={1} gap={4}>
      <ActivityLog />
    </StackV>
  );
}
