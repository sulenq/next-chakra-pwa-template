"use client";

import { Btn } from "@/components/ui/btn";
import { Img } from "@/components/ui/img";
import { SearchInput } from "@/components/ui/search-input";
import { TableSkeleton } from "@/components/ui/skeleton";
import { StackV } from "@/components/ui/stack";
import { DataDisplayToggle } from "@/components/widgets/data-display-toggle";
import { DataGrid } from "@/components/widgets/data-grid";
import { DataTable } from "@/components/widgets/data-table";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { LucideIcon } from "@/components/widgets/icon";
import { Item } from "@/components/widgets/item";
import { MainView, useViewContext } from "@/components/widgets/main-view";
import { ScrollH } from "@/components/widgets/scroll-h";
import { BASE_ICON_BOX_SIZE, GAP, R_SPACING_MD } from "@/constants/styles";
import { useDataDisplay } from "@/contexts/use-data-display-context";
import { useLocale } from "@/contexts/use-locale-context";
import {
  BatchOptionsTableOptionGenerator,
  DataProps,
  RowOptionsTableOptionGenerator,
} from "@/types/global.types";
import { isEmptyArray, last } from "@/utils/array";
import { pluckString } from "@/utils/string";
import { getActiveNavs, imgUrl } from "@/utils/url";
import { HStack, Icon } from "@chakra-ui/react";
import { ArrowDownAz, ListFilterIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLayananQuery } from "../hooks/use-layanan";
import { LayananItem } from "../types/layanan.types";
import { LayananCreate } from "./layanan.create";
import { LayananDelete } from "./layanan.delete";
import { LayananUpdate } from "./layanan.update";

const PREFIX_ID = `layanan`;
const DEFAULT_FILTER = {
  search: "",
};

const DataUtils = (props: any) => {
  // Props
  const { filter, setFilter, ...restProps } = props;

  return (
    <HStack w={"full"} {...restProps}>
      <SearchInput
        queryKey={"q-layanan"}
        inputProps={{
          size: "sm",
        }}
        minW={"200px"}
      />

      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          <LucideIcon icon={ListFilterIcon} />
        </Icon>
      </Btn>

      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={BASE_ICON_BOX_SIZE}>
          <LucideIcon icon={ArrowDownAz} />
        </Icon>
      </Btn>

      <DataDisplayToggle iconButton navKey={PREFIX_ID} size={"sm"} />
    </HStack>
  );
};

const Data = (props: any) => {
  // Props
  const { filter, routeTitle, isSmContainer } = props;

  // Contexts
  const { locale } = useLocale();
  const displayMode = useDataDisplay((s) => s.getDisplay(PREFIX_ID));
  const displayTable = displayMode === "table";

  // Query
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useLayananQuery({
    search: filter?.search,
  });

  // Constants
  const data = response?.data || [];
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
    rows: data.map((item, idx) => {
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

  if (isLoading) return <TableSkeleton />;
  if (isError) return <FeedbackRetry onRetry={refetch} />;
  if (isEmptyArray(data)) return <FeedbackNoData />;

  return displayTable ? (
    <DataTable.Display
      headers={dataProps.headers}
      rows={dataProps.rows}
      rowOptions={dataProps.rowOptions}
      batchOptions={dataProps.batchOptions}
    />
  ) : (
    <DataGrid.Display
      data={data}
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
  );
};

export default function LayananPage() {
  // Contexts
  const { t } = useLocale();
  const { isSmContainer } = useViewContext();

  // Hooks
  const pathname = usePathname();

  // States
  const [filter, setFilter] = useState(DEFAULT_FILTER);

  // Constants
  const activeNav = getActiveNavs(pathname);

  // Derived Values
  const routeTitle =
    last(activeNav)?.label || pluckString(t, last(activeNav)?.labelKey || "");

  return (
    <MainView.Content p={GAP}>
      <StackV flex={1} overflowY={"auto"}>
        <MainView.Header
          withTitle
          MainViewTitleProps={{
            ml: [2, null, 0],
          }}
          justify={"space-between"}
        >
          <HStack>
            {!isSmContainer && (
              <DataUtils
                filter={filter}
                setFilter={setFilter}
                routeTitle={routeTitle}
              />
            )}

            <LayananCreate />
          </HStack>
        </MainView.Header>

        {isSmContainer && (
          <ScrollH mb={4}>
            <HStack minW={"full"} justify={"space-between"} px={R_SPACING_MD}>
              <DataUtils
                filter={filter}
                setFilter={setFilter}
                routeTitle={routeTitle}
              />
            </HStack>
          </ScrollH>
        )}

        <Item.Body flex={1} overflowY={"auto"}>
          <Data
            filter={filter}
            routeTitle={routeTitle}
            isSmContainer={isSmContainer}
          />
        </Item.Body>
      </StackV>
    </MainView.Content>
  );
}
