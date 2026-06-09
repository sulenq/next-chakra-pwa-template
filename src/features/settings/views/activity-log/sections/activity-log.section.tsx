"use client";

import { Item } from "@/components/container/item";
import { DataListFooter } from "@/components/data-list/data-footer";
import { SettingsHelperText } from "@/components/ui/typography";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackH, StackV } from "@/components/ui/stack";
import { MiniUser } from "@/components/user/mini-user";
import { activityActionTemplates } from "@/constants/activity-action";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-list";
import { DUMMY_ALL_ACTIVITY_LOGS } from "@/constants/dummy-data";
import { SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import type { ActivityLog } from "@/types/global.types";
import { formatDate } from "@/utils/formatter";
import { useState } from "react";

// -----------------------------------------------------------------

export const ActivityLogSection = () => {
  // Stores
  const { t } = useLocaleStore();

  // Constants
  const data = DUMMY_ALL_ACTIVITY_LOGS;

  // States
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [page, setPage] = useState<number>(DEFAULT_PAGE);

  // Utils
  const formatActivityLog = (log: ActivityLog): string => {
    return activityActionTemplates[log.action](log.metadata);
  };

  return (
    <Item.Root px={SPACING_MD}>
      <SettingsHelperText>{t.activity_logs}</SettingsHelperText>

      <Item.Body>
        <StackV p={4}>
          <SearchInput
            onChange={(value) => {
              setSearch(value || "");
            }}
            value={search}
            queryKey={"q-activity-auth"}
          />
        </StackV>

        <StackV minH={"300px"}>
          {data?.map((log, index) => {
            return (
              <StackH
                align={"center"}
                key={`${log.id}-${index}`}
                gap={4}
                p={4}
                justify={"space-between"}
                borderTop={index === 0 ? "" : "1px solid"}
                borderColor={"border.subtle"}
              >
                {log.user && <MiniUser withEmail user={log.user} w={"240px"} />}

                <StackV flex={1}>
                  <P>{formatActivityLog(log)}</P>

                  <P color={"fg.subtle"}>
                    {formatDate(log?.createdAt, t, {
                      variant: "dayShortMonthYear",

                      withTime: true,
                    })}
                  </P>
                </StackV>
              </StackH>
            );
          })}
        </StackV>

        <DataListFooter
          limit={limit}
          setLimit={setLimit}
          currentDataLength={15}
          totalData={1000}
          page={page}
          setPage={setPage}
          totalPage={100}
        />
      </Item.Body>
    </Item.Root>
  );
};
