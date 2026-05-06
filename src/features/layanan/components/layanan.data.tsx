"use client";

import { Img } from "@/components/ui/img";
import { TableSkeleton } from "@/components/ui/skeleton";
import { DataGrid } from "@/components/widgets/data-grid";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { TopLoadingBar } from "@/components/widgets/loading-bar";
import { useMainViewContext } from "@/components/widgets/main-view";
import { useDataDisplay } from "@/contexts/use-data-display-context";
import { useLocale } from "@/contexts/use-locale-context";
import { LayananDelete } from "@/features/layanan/components/layanan.delete";
import { LayananUpdate } from "@/features/layanan/components/layanan.update";
import { useLayananQuery } from "@/features/layanan/hooks/use-layanan";
import { LAYANAN_ID } from "@/features/layanan/pages/layanan.page";
import { LayananItem } from "@/features/layanan/types/layanan.types";
import {
  BatchOptionsTableOptionGenerator,
  DataProps,
  RowOptionsTableOptionGenerator,
} from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { imgUrl } from "@/utils/url";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface LayananDataProps extends StackProps {
  filter: any;
  routeTitle: string;
}

export const LayananData = (props: LayananDataProps) => {
  // Props
  const { filter, routeTitle } = props;

  // Contexts
  const { locale } = useLocale();
  const { isSmContainer } = useMainViewContext();
  const displayMode = useDataDisplay((s) => s.getDisplay(LAYANAN_ID));
  const displayTable = displayMode === "table";

  // Query
  const { dataList, isLoading, isError, refetch } = useLayananQuery({
    ...filter,
  });

  // Constants
  const dataProps: DataProps = {
    headers: [
      {
        th: "Icon",
      },
      {
        th: "Title",
        sortable: true,
      },
      {
        th: "Description",
        sortable: true,
      },
    ],
    rows: dataList?.map((item, idx) => {
      return {
        id: `${item.id}`,
        idx: idx,
        data: item,
        columns: [
          {
            td: <Img src={imgUrl(item.icon)} boxSize={"20px"} fluid />,
            value: item.icon,
          },
          {
            td: item.title?.[locale],
            value: item.title?.[locale],
          },
          {
            td: item.description?.[locale],
            value: item.description?.[locale],
          },
        ],
      };
    }),
    rowOptions: [
      (row) => ({
        override: <LayananUpdate item={row.data} />,
      }),
      (row) => ({
        override: <LayananDelete ids={[row.id]} />,
      }),
    ] as RowOptionsTableOptionGenerator<LayananItem>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => ({
        override: (
          <LayananDelete
            ids={ids}
            clearSelectedRows={clearSelectedRows}
            disabled={isEmptyArray(ids)}
          />
        ),
      }),
    ] as BatchOptionsTableOptionGenerator[],
  };

  if (isLoading)
    return (
      <>
        <TopLoadingBar loading={isLoading} />
        <TableSkeleton />
      </>
    );
  if (isError) return <FeedbackRetry onRetry={refetch} />;
  if (isEmptyArray(dataList)) return <FeedbackNoData />;

  return (
    <>
      {displayTable ? (
        <DataTable.Display
          headers={dataProps.headers}
          rows={dataProps.rows}
          rowOptions={dataProps.rowOptions}
          batchOptions={dataProps.batchOptions}
        />
      ) : (
        <DataGrid.Display
          data={dataList}
          dataProps={dataProps}
          gridItem={({
            item,
            row,
            details,
            selectedRows,
            toggleRowSelection,
          }: any) => {
            const resolvedItem: LayananItem = item;
            return (
              <DataGrid.Item
                key={resolvedItem.id}
                item={{
                  id: `${resolvedItem.id}`,
                  imgSrc: resolvedItem.icon,
                  showImg: true,
                  title: resolvedItem.title?.[locale],
                  description: resolvedItem.description?.[locale],
                }}
                dataProps={dataProps}
                row={row}
                selectedRows={selectedRows}
                toggleRowSelection={toggleRowSelection}
                routeTitle={routeTitle}
                details={details}
              />
            );
          }}
          mt={isSmContainer ? 3 : 0}
        />
      )}
    </>
  );
};
