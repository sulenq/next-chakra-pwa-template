import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { Skeleton } from "@/components/ui/skeleton";
import { StackH, StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/branding/app-icon";
import { ClampText } from "@/components/ui/clamp-text";
import { DataListFooter } from "@/components/data-list/data-footer";
import FeedbackNoData from "@/components/feedback/feedback-no-data";
import FeedbackNotFound from "@/components/feedback/feedback-not-found";
import FeedbackRetry from "@/components/feedback/feedback-retry";
import { Item, ItemRootProps } from "@/components/container/item";
import { DUMMY_AUTH_LOGS } from "@/constants/dummy-data";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useFetchData } from "@/hooks/useFetchData";
import { AuthLog } from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { formatDate } from "@/utils/formatter";
import { Circle } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";

// -----------------------------------------------------------------

export const AuthLogSection = (props: ItemRootProps) => {
  // Contexts
  const { t } = useLocaleStore();

  // Refs

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
    items: AuthLog[];
  }>({
    // TODO_DEV add url and set initial data to undefined
    initialData: {
      totalData: 100,
      items: DUMMY_AUTH_LOGS,
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
          const isSignin = log?.action === "Sign in";

          return (
            <StackH
              key={`${log.id}-${index}`}
              align={"center"}
              gap={4}
              p={4}
              justify={"space-between"}
              borderTop={index === 0 ? "" : "1px solid"}
              borderColor={"border.subtle"}
            >
              <Circle p={1} bg={isSignin ? "bg.success" : "bg.error"}>
                <AppIconLucide
                  icon={isSignin ? ArrowDownIcon : ArrowUpIcon}
                  color={isSignin ? "fg.success" : "fg.error"}
                />
              </Circle>

              <StackV w={"full"}>
                <P>
                  {formatDate(log?.createdAt, t, {
                    variant: "dayShortMonthYear",
                    withTime: true,
                  })}
                </P>

                <P color={"fg.subtle"}>{log?.ip}</P>
              </StackV>

              <ClampText color={"fg.subtle"} textAlign={"right"} lineClamp={2}>
                {log?.userAgent}
              </ClampText>
            </StackH>
          );
        })}
      </>
    ),
  };

  return (
    <Item.Root px={R_SPACING_MD} {...props}>
      <SettingsHelperText>{t.my_auth_logs}</SettingsHelperText>

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
                  {(!data?.items || isEmptyArray(data.items)) && render.empty}
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
