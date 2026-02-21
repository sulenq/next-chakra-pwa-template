"use client";

import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { Skeleton } from "@/components/ui/skeleton";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { LucideIcon } from "@/components/widget/Icon";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { Limitation } from "@/components/widget/Limitation";
import { MiniUser } from "@/components/widget/MiniUser";
import { Pagination } from "@/components/widget/Pagination";
import { dummyAllActivityLogs } from "@/constants/dummyData";
import { Enum__ActivityAction } from "@/constants/enums";
import { Interface__ActivityLog } from "@/constants/interfaces";
import { BASE_ICON_BOX_SIZE } from "@/constants/styles";
import useLang from "@/context/useLang";
import useDataState from "@/hooks/useDataState";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { HStack, Icon } from "@chakra-ui/react";
import { ActivityIcon } from "lucide-react";

const ActivityLog = () => {
  // Contexts
  const { l } = useLang();

  // States
  const activityFormatter: Record<
    string,
    (meta?: Record<string, any>) => string
  > = {
    // TODO create action sentence glosary
    [Enum__ActivityAction.CREATE_WORKSPACE]: (meta) =>
      `Created workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [Enum__ActivityAction.UPDATE_WORKSPACE]: (meta) =>
      `Updated workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [Enum__ActivityAction.DELETE_WORKSPACE]: (meta) =>
      `Deleted workspace "${meta?.workspaceName ?? "Unknown"}"`,

    [Enum__ActivityAction.CREATE_LAYER]: (meta) =>
      `Created layer "${meta?.layerName ?? "Unknown"}"`,

    [Enum__ActivityAction.UPDATE_LAYER]: (meta) =>
      `Updated layer "${meta?.layerName ?? "Unknown"}"`,

    [Enum__ActivityAction.DELETE_LAYER]: (meta) =>
      `Deleted layer "${meta?.layerName ?? "Unknown"}`,
  };
  const formatActivityLog = (log: Interface__ActivityLog): string => {
    return activityFormatter[log.action as Enum__ActivityAction](log.metadata);
  };
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
  } = useDataState<Interface__ActivityLog[]>({
    initialData: dummyAllActivityLogs,
    url: ``,
    dataResource: false,
  });
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        {data?.map((log, idx) => {
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
              {log.user && <MiniUser user={log.user} w={"240px"} />}

              <CContainer flex={1} w={"fit"}>
                <P>{formatActivityLog(log)}</P>

                <P color={"fg.subtle"}>
                  {formatDate(log?.createdAt, l, {
                    variant: "dayShortMonthYear",

                    withTime: true,
                  })}
                </P>
              </CContainer>
            </HStack>
          );
        })}
      </>
    ),
  };

  return (
    <ItemContainer borderless roundedless flex={1}>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={BASE_ICON_BOX_SIZE}>
            <LucideIcon icon={ActivityIcon} />
          </Icon>
          <ItemHeaderTitle>{l.activity_logs}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer minH={"300px"}>
        {initialLoading && render.loading}
        {!initialLoading && (
          <>
            {error && render.error}
            {!error && (
              <>
                {data && render.loaded}
                {(!data || isEmptyArray(data)) && render.empty}
              </>
            )}
          </>
        )}
      </CContainer>

      <HStack
        justify={"space-between"}
        wrap={"wrap"}
        p={2}
        borderTop={"1px solid"}
        borderColor={"border.muted"}
        mt={"auto"}
      >
        <Limitation limit={limit} setLimit={setLimit} />

        <Pagination
          page={page}
          setPage={setPage}
          totalPage={pagination?.meta?.totalPage}
        />
      </HStack>
    </ItemContainer>
  );
};

export default function Page() {
  return (
    <CContainer flex={1} gap={4} bg={"bgContent"}>
      <ActivityLog />
    </CContainer>
  );
}
