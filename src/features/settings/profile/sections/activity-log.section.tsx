import { Item, ItemRootProps } from "@/components/container/item";
import { DataListFooter } from "@/components/data-list/data-footer";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackH, StackV } from "@/components/ui/stack";
import { activityActionTemplates } from "@/constants/activity-action";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-list";
import { DUMMY_ACTIVITY_LOGS } from "@/constants/dummy-data";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { ActivityLog } from "@/types/global.types";
import { formatDate } from "@/utils/formatter";
import { useState } from "react";

export const ActivityLogSection = (props: ItemRootProps) => {
  // Store
  const { t } = useLocaleStore();

  // Constants
  const data = DUMMY_ACTIVITY_LOGS;

  // States
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [page, setPage] = useState<number>(DEFAULT_PAGE);

  // Utils
  const formatActivityLog = (log: ActivityLog): string => {
    return activityActionTemplates[log.action](log.metadata);
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
          {data?.map((log, index) => {
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
        </StackV>

        <DataListFooter
          limit={limit}
          setLimit={setLimit}
          dataLength={15}
          totalData={1000}
          page={page}
          setPage={setPage}
          totalPage={100}
        />
      </Item.Body>
    </Item.Root>
  );
};
