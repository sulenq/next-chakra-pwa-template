"use client";

import { P } from "@/components/ui/p";
import { StackH, StackV } from "@/components/ui/stack";
import { Limitation } from "@/components/widgets/limitation";
import { Pagination } from "@/components/widgets/pagination";
import { TABLE_FOOTER_BORDER_COLOR } from "@/constants/styles";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { formatNumber } from "@/utils/formatter";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface DataFooterProps extends Omit<StackProps, "page"> {
  borderless?: boolean;
  dataLength?: number;
  totalData?: number;
  limit: number;
  setLimit: React.Dispatch<number>;
  page: number;
  setPage: React.Dispatch<number>;
  totalPage?: number;
}

export const DataFooter = (props: DataFooterProps) => {
  // Props
  const {
    borderless = false,
    dataLength,
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
  const dataLenghContent = `${dataLength ? `${formatNumber(dataLength)}` : "?"} / ${totalData != null ? formatNumber(totalData) : "?"} items`;

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
          {!iss && <P color={"fg.subtle"}>{dataLenghContent}</P>}

          <Pagination page={page} setPage={setPage} totalPage={totalPage} />
        </StackH>
      </StackH>
    </StackV>
  );
};
