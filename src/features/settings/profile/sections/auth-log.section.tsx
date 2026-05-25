import { AppIconLucide } from "@/components/branding/app-icon";
import { Item, ItemRootProps } from "@/components/container/item";
import { DataListFooter } from "@/components/data-list/data-footer";
import { ClampText } from "@/components/ui/clamp-text";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackH, StackV } from "@/components/ui/stack";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-list";
import { DUMMY_AUTH_LOGS } from "@/constants/dummy-data";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { formatDate } from "@/utils/formatter";
import { Circle } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { useState } from "react";

// -----------------------------------------------------------------

export const AuthLogSection = (props: ItemRootProps) => {
  // Store
  const { t } = useLocaleStore();

  // Constants
  const data = DUMMY_AUTH_LOGS;

  // States
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [page, setPage] = useState<number>(DEFAULT_PAGE);

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
          {data?.map((log, index) => {
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

                <ClampText
                  color={"fg.subtle"}
                  textAlign={"right"}
                  lineClamp={2}
                >
                  {log?.userAgent}
                </ClampText>
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
