"use client";

import { Btn } from "@/components/ui/btn";
import { Img } from "@/components/ui/img";
import { TableSkeleton } from "@/components/ui/skeleton";
import { StackH, StackV } from "@/components/ui/stack";
import { ClampText } from "@/components/widgets/clamp-text";
import { DataGrid } from "@/components/widgets/data-grid";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { ImgViewer } from "@/components/widgets/img-viewer";
import { TopLoadingBar } from "@/components/widgets/loading-bar";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@/constants/data-list";
import { useDataDisplay } from "@/contexts/use-data-display-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import { LayananDelete } from "@/features/layanan/components/layanan.delete";
import { LayananUpdate } from "@/features/layanan/components/layanan.update";
import { useLayananListQuery } from "@/features/layanan/hooks/use-layanan";
import { LAYANAN_ID } from "@/features/layanan/pages/layanan.page";
import { LayananItem } from "@/features/layanan/types/layanan.types";
import {
  BatchOptionsTableOptionGenerator,
  DataListConfig,
  RowOptionsTableOptionGenerator,
} from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { imgUrl } from "@/utils/url";
import { Box, StackProps } from "@chakra-ui/react";
import { useState } from "react";

// -----------------------------------------------------------------

interface LayananListProps extends StackProps {
  filter: any;
}

export const LayananList = (props: LayananListProps) => {
  // Props
  const { filter } = props;

  // States
  const [limit, setLimit] = useState<number>(DEFAULT_LIMIT);
  const [page, setPage] = useState<number>(DEFAULT_PAGE);

  // Contexts
  const { t, locale } = useLocale();
  const { themeContext } = useThemeContext();
  const isDisplayTable =
    useDataDisplay((s) => s.getDisplay(LAYANAN_ID)) === "table";

  // Query
  const { dataList, pagination, isLoading, isFetching, isError, refetch } =
    useLayananListQuery(filter);

  // Constants
  const dataListConfig: DataListConfig = {
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
    rows: dataList?.map((item, index) => {
      return {
        id: `${item.id}`,
        index: index,
        item: item,
        columns: [
          {
            td: <Img src={imgUrl(item.icon)} boxSize={"20px"} fluid />,
            value: item.icon,
            dataType: "image",
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
      (row) => <LayananUpdate item={row.item} />,
      (row) => <LayananDelete ids={[row.id]} />,
    ] as RowOptionsTableOptionGenerator<LayananItem>[],
    batchOptions: [
      (ids, { clearSelectedRows }) => (
        <LayananDelete
          ids={ids}
          clearSelectedRows={clearSelectedRows}
          disabled={isEmptyArray(ids)}
        />
      ),
    ] as BatchOptionsTableOptionGenerator[],
  };

  if (isLoading) return <TableSkeleton />;
  if (isError) return <FeedbackRetry onRetry={refetch} />;
  if (isEmptyArray(dataList)) return <FeedbackNoData />;

  return (
    <>
      <TopLoadingBar loading={isFetching} />

      {isDisplayTable ? (
        <DataTable.Root
          headers={dataListConfig.headers}
          rows={dataListConfig.rows}
          rowOptions={dataListConfig.rowOptions}
          batchOptions={dataListConfig.batchOptions}
          page={page}
          setPage={setPage}
          totalPage={pagination.totalPage}
          totalData={pagination.totalData}
          limit={limit}
          setLimit={setLimit}
        />
      ) : (
        <DataGrid.Root
          headers={dataListConfig.headers}
          rows={dataListConfig.rows}
          rowOptions={dataListConfig.rowOptions}
          batchOptions={dataListConfig.batchOptions}
          gridItem={({ row, details }) => {
            const item = row.item as LayananItem;

            return (
              <DataGrid.Item key={item.id} id={item.id.toString()}>
                <Box p={1}>
                  <ImgViewer
                    id={`img-viewer-${imgUrl(item.icon)}`}
                    src={imgUrl(item.icon)}
                    w={"full"}
                    h={"fit"}
                  >
                    <Img
                      key={imgUrl(item.icon)}
                      src={imgUrl(item.icon)}
                      aspectRatio={1}
                      rounded={`calc(${themeContext.radii.component} - 4px)`}
                    />
                  </ImgViewer>
                </Box>

                <StackV gap={1} p={3}>
                  <ClampText>{item.title?.[locale]}</ClampText>
                  <ClampText color={"fg.subtle"}>
                    {item.description?.[locale]}
                  </ClampText>
                </StackV>

                <StackH gap={1.5} p={1.5}>
                  <DataGrid.DetailTrigger
                    key={item.id}
                    id={item.id}
                    details={details}
                    w={"full"}
                  >
                    <Btn
                      variant={"ghost"}
                      size={"sm"}
                      color={"fg.muted"}
                      rounded={themeContext.radii.component}
                    >
                      {t.view_more}
                    </Btn>
                  </DataGrid.DetailTrigger>

                  <DataGrid.RowOptions
                    row={row}
                    rowOptions={dataListConfig.rowOptions}
                  />
                </StackH>
              </DataGrid.Item>
            );
          }}
          page={page}
          setPage={setPage}
          totalPage={pagination.totalPage}
          totalData={pagination.totalData}
          limit={limit}
          setLimit={setLimit}
        />
      )}
    </>
  );
};
