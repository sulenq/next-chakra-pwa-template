import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { StackH, StackV } from "@/components/ui/stack";
import { DataListFooter } from "@/components/data-list/data-footer";
import FeedbackNoData from "@/components/feedback/feedback-no-data";
import FeedbackNotFound from "@/components/feedback/feedback-not-found";
import FeedbackRetry from "@/components/feedback/feedback-retry";
import { Item, ItemRootProps } from "@/components/container/item";
import { DUMMY_ACTIVITY_LOGS } from "@/constants/dummy-data";
import { ActivityActionEnum } from "@/constants/enums";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useFetchData } from "@/hooks/useFetchData";
import { ActivityLog } from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { useState } from "react";

export const ActivityLogSection = (props: ItemRootProps) => {
  // Contexts
  const { t } = useLocaleStore();

  // States
  const [search, setSearch] = useState("");
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
  const formatActivityLog = (log: ActivityLog): string => {
    return activityFormatter[log.action as ActivityActionEnum](log.metadata);
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
  } = useFetchData<{
    totalData: number;
    items: ActivityLog[];
  }>({
    // TODO_DEV add url and set initial data to undefined
    initialData: {
      totalData: 100,
      items: DUMMY_ACTIVITY_LOGS,
    },
    url: ``,
    dependencies: [search],
  });

  // Render State Map
  const render = {
    loading: <Skeleton flex={1} />,
    error: <FeedbackRetry onRetry={onRetry} />,
    empty: <FeedbackNoData />,
    notFound: <FeedbackNotFound />,
    loaded: (
      <>
        {data?.items?.map((log, index) => {
          return (
            <StackH
              key={`${log.id}-${index}`}
              justify={"space-between"}
              borderTop={index === 0 ? "" : "1px solid"}
              borderColor={"border.subtle"}
              p={4}
            >
              <StackV>
                <P>{formatActivityLog(log)}</P>

                <P color={"fg.subtle"}>
                  {formatDate(log?.createdAt, t, {
                    variant: "dayShortMonthYear",
                    withTime: true,
                  })}
                </P>
              </StackV>

              <P color={"fg.subtle"} textAlign={"right"}>
                {/* {log?.userAgent} */}
              </P>
            </StackH>
          );
        })}
      </>
    ),
  };

  return (
    <Item.Root px={R_SPACING_MD} {...props}>
      <SettingsHelperText>{t.my_activity_logs}</SettingsHelperText>

      <Item.Body>
        <StackV p={4}>
          <SearchInput
            onChange={(inputValue) => {
              setSearch(inputValue || "");
            }}
            inputValue={search}
            queryKey={"q-my-log-auth"}
          />
        </StackV>

        <StackV>
          {initialLoading && render.loading}
          {!initialLoading && (
            <>
              {error && render.error}
              {!error && (
                <>
                  {data?.items && render.loaded}
                  {(!data?.items || isEmptyArray(data?.items)) && render.empty}
                </>
              )}
            </>
          )}
        </StackV>

        <DataListFooter
          limit={limit}
          setLimit={setLimit}
          dataLength={data?.items?.length}
          totalData={data?.totalData}
          page={page}
          setPage={setPage}
          totalPage={pagination?.meta?.totalPage}
        />
      </Item.Body>
    </Item.Root>
  );
};
