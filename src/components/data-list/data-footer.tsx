"use client";

import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { Limitation } from "@/components/data-list/data-limitation";
import { Pagination } from "@/components/data-list/data-pagination";
import { TABLE_FOOTER_BORDER_COLOR } from "@/constants/styles";
import { useIsSmScreenWidth } from "@/hooks/use-is-sm-screen-width";
import { formatNumber } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";

// -----------------------------------------------------------------

interface DataListFooterProps extends Omit<StackProps, "page"> {
  borderless?: boolean;
  currentDataLength?: number;
  totalData?: number;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPage?: number;
}

export const DataListFooter = (props: DataListFooterProps) => {
  // Props
  const {
    borderless = false,
    currentDataLength,
    totalData,
    limit,
    setLimit,
    page,
    setPage,
    totalPage,
    ...restProps
  } = props;

  // Hooks
  const iss = useIsSmScreenWidth();

  // Constants
  const dataLenghContent = `${currentDataLength ? `${formatNumber(currentDataLength)}` : "?"} / ${totalData != null ? formatNumber(totalData) : "?"} items`;

  return (
    <StackV
      p={3}
      gap={2}
      borderTop={borderless ? "none" : "1px solid"}
      borderColor={TABLE_FOOTER_BORDER_COLOR}
      {...restProps}
    >
      {iss && (
        <P color={"fg.subtle"} textAlign={"center"}>
          {dataLenghContent}
        </P>
      )}

      <StackH align={"center"} w={"full"} justify={"space-between"}>
        <StackH align={"start"}>
          <Limitation limit={limit} setLimit={setLimit} />
        </StackH>

        <StackH align={"center"} gapX={3}>
          {!iss && (
            <P color={"fg.subtle"} whiteSpace={"nowrap"}>
              {dataLenghContent}
            </P>
          )}

          <Pagination page={page} setPage={setPage} totalPage={totalPage} />
        </StackH>
      </StackH>
    </StackV>
  );
};
