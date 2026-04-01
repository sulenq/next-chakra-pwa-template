import { Checkbox } from "@/components/ui/checkbox";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { BatchOptions } from "@/components/widgets/batch-option";
import { DataFooter } from "@/components/widgets/data-footer";
import { RowOptions } from "@/components/widgets/row-options";
import { SortIcon } from "@/components/widgets/sort-icon";
import {
  BatchOptionsTableOptionGenerator,
  FormattedTableHeader,
  FormattedTableRow,
  RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import {
  BACKDROP_BLUR_FILTER,
  GAP,
  R_SPACING_MD,
  TABLE_CELL_PX,
  TABLE_CELL_PY,
  TABLE_CONTAINER_BG,
  TABLE_OPTIONS_CELL_W,
  TABLE_TD_BG,
  TABLE_TD_BORDER_COLOR,
  TABLE_TD_MIN_H,
  TABLE_TH_BG,
  TABLE_TH_BORDER_COLOR,
  TABLE_TH_H,
} from "@/constants/styles";
import { Type__SortHandler } from "@/constants/types";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useScreen } from "@/hooks/useScreen";
import { isEmptyArray } from "@/utils/array";
import {
  Box,
  Center,
  Grid,
  HStack,
  StackProps,
  TableRowProps,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

// -----------------------------------------------------------------

export interface DataTableProps extends Omit<StackProps, "page"> {
  trBodyProps?: TableRowProps | any;
  headers?: FormattedTableHeader[];
  rows?: FormattedTableRow[];
  rowOptions?: RowOptionsTableOptionGenerator[];
  batchOptions?: BatchOptionsTableOptionGenerator[];
  initialSortColumnIndex?: number;
  initialSortOrder?: "asc" | "desc";
  limit?: number;
  setLimit?: React.Dispatch<number>;
  page?: number;
  setPage?: React.Dispatch<number>;
  totalPage?: number;
  totalData?: number;
  loading?: boolean;
  contentContainerProps?: StackProps;
}

export const DataTableDisplay = (props: DataTableProps) => {
  // Props
  const {
    trBodyProps,
    headers = [],
    rows = [],
    rowOptions = [],
    batchOptions = [],
    initialSortColumnIndex = 0,
    initialSortOrder = "asc",
    limit = 15,
    setLimit,
    page = 1,
    setPage,
    totalPage,
    totalData,
    contentContainerProps,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Refs
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { sh } = useScreen();

  // States
  const [tableData, setTableData] = useState(rows);
  const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    sortColumnIdx?: number;
    direction: "asc" | "desc";
  }>({
    sortColumnIdx: initialSortColumnIndex || undefined,
    direction: initialSortOrder || "asc",
  });
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    setIsFirefox(
      typeof window !== "undefined" && navigator.userAgent.includes("Firefox"),
    );
  }, []);

  const sortHandlers: Record<string, Type__SortHandler> = {
    string: (aValue, bValue, direction) =>
      direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue)),

    number: (aValue, bValue, direction) =>
      direction === "asc"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue),

    date: (aValue, bValue, direction) => {
      const dateA = aValue ? new Date(aValue).getTime() : NaN;
      const dateB = bValue ? new Date(bValue).getTime() : NaN;

      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return direction === "asc" ? 1 : -1;
      if (isNaN(dateB)) return direction === "asc" ? -1 : 1;

      return direction === "asc" ? dateA - dateB : dateB - dateA;
    },

    time: (aValue, bValue, direction) =>
      direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue)),
  };
  const sortedTableData = useMemo(() => {
    if (sortConfig.sortColumnIdx == null) return tableData;

    const columnIndex = sortConfig.sortColumnIdx;
    const dataType = tableData[0]?.columns[columnIndex]?.dataType || "string";

    const sortHandler = sortHandlers[dataType] || sortHandlers.string;

    return [...tableData].sort((a, b) => {
      const aValue = a.columns[columnIndex]?.value ?? "";
      const bValue = b.columns[columnIndex]?.value ?? "";

      return sortHandler(aValue, bValue, sortConfig.direction);
    });
  }, [tableData, sortConfig]);
  const resolvedTableData =
    sortConfig.sortColumnIdx !== null && sortConfig.sortColumnIdx !== undefined
      ? sortedTableData
      : tableData;
  const hasFooter = limit && setLimit && page && setPage;

  // Utils
  function sort(columnIndex: number) {
    setSortConfig((prevConfig) => {
      if (prevConfig.sortColumnIdx === columnIndex) {
        if (prevConfig.direction === "asc") {
          return { sortColumnIdx: columnIndex, direction: "desc" };
        } else if (prevConfig.direction === "desc") {
          // if desc, remove sort config
          return { sortColumnIdx: undefined, direction: "asc" };
        }
      } else {
        // if sort config is not set, sort asc
        return { sortColumnIdx: columnIndex, direction: "asc" };
      }

      return prevConfig;
    });
  }
  function handleSelectAllRows(isChecked: boolean) {
    setAllRowsSelected(!allRowsSelected);
    if (!isChecked) {
      const allIds = tableData.map((row) => row.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  }
  function handleClearSelectedRows() {
    setAllRowsSelected(false);
    setSelectedRows([]);
  }
  function toggleRowSelection(row: FormattedTableRow) {
    const rowId = row.id;
    setSelectedRows((ps) => {
      const isSelected = ps.includes(rowId);

      if (isSelected) {
        setAllRowsSelected(false);
        return ps.filter((id) => id !== rowId);
      } else {
        if (tableData.length === selectedRows.length + 1) {
          setAllRowsSelected(true);
        }
        return [...ps, rowId];
      }
    });
  }

  // Set initial table data source of truth
  useEffect(() => {
    setTableData([...rows]);
  }, [rows]);

  // SX
  const SELECTED_BG = `${themeConfig.colorPalette}.subtle`;
  const TABLE_ROW_ROUNDED = 0;

  // Grid Cols Generator
  const gridCols = useMemo(() => {
    const cols = [];
    if (!isEmptyArray(batchOptions)) cols.push(TABLE_OPTIONS_CELL_W);
    headers.forEach(() => cols.push("auto"));
    if (!isEmptyArray(rowOptions)) cols.push(TABLE_OPTIONS_CELL_W);
    return cols.join(" ");
  }, [batchOptions, headers, rowOptions]);

  return (
    <StackV
      ref={tableContainerRef}
      flex={1}
      px={R_SPACING_MD}
      pt={R_SPACING_MD}
      overflow={"auto"}
      minH={props?.minH || sh < 625 ? "400px" : ""}
      pos={"relative"}
      {...restProps}
    >
      <StackV
        className={"scrollX scrollYAlt"}
        flex={1}
        pb={R_SPACING_MD}
        bg={TABLE_CONTAINER_BG}
        roundedTop={themeConfig.radii.container}
        zIndex={2}
        {...contentContainerProps}
      >
        <Grid
          gridTemplateColumns={gridCols}
          w={headers.length > 1 ? "full" : "fit"}
          minW={"fit"}
          rowGap={GAP}
        >
          {/* Header Row */}
          <Box display={"contents"} role={"row"}>
            {/* Batch options column */}
            {!isEmptyArray(batchOptions) && (
              <Center
                h={"full"}
                px={"10px"}
                minW={"0% !important"}
                minH={TABLE_TH_H}
                bg={isFirefox ? "bg.bodySolid" : TABLE_TH_BG}
                backdropFilter={isFirefox ? "none" : BACKDROP_BLUR_FILTER}
                borderBottom={"1px solid"}
                borderColor={TABLE_TH_BORDER_COLOR}
                roundedLeft={TABLE_ROW_ROUNDED}
                pos={"sticky"}
                left={0}
                top={0}
                zIndex={4}
                isolation={"isolate"}
              >
                <BatchOptions
                  selectedRows={selectedRows}
                  clearSelectedRows={handleClearSelectedRows}
                  batchOptions={batchOptions}
                  allRowsSelected={allRowsSelected}
                  handleSelectAllRows={handleSelectAllRows}
                  tableContainerRef={tableContainerRef}
                />
              </Center>
            )}

            {/* Main columns */}
            {headers.map((header, index) => (
              <HStack
                key={index}
                justify={header.align}
                h={"full"}
                minH={TABLE_TH_H}
                px={TABLE_CELL_PX}
                py={TABLE_CELL_PY}
                pl={index === 0 ? 4 : ""}
                pr={
                  index === headers.length - 1
                    ? 4
                    : (header?.headerProps?.justify === "center" ||
                          header?.headerProps?.justifyContent === "center") &&
                        header.sortable
                      ? 1
                      : ""
                }
                bg={isFirefox ? "bg.bodySolid" : TABLE_TH_BG}
                backdropFilter={isFirefox ? "none" : BACKDROP_BLUR_FILTER}
                borderBottom={"1px solid"}
                borderColor={TABLE_TH_BORDER_COLOR}
                whiteSpace={"nowrap"}
                cursor={header.sortable ? "pointer" : "auto"}
                zIndex={3}
                pos={"sticky"}
                top={0}
                isolation={"isolate"}
                onClick={header.sortable ? () => sort(index) : undefined}
                {...header?.headerProps}
              >
                <P color={"fg.muted"} fontWeight={"medium"}>
                  {header?.th}
                </P>

                {header.sortable && (
                  <SortIcon
                    columnIndex={index}
                    sortColumnIdx={sortConfig.sortColumnIdx}
                    direction={sortConfig.direction}
                  />
                )}
              </HStack>
            ))}

            {/* Row options column */}
            {!isEmptyArray(rowOptions) && (
              <HStack
                h={"full"}
                minH={TABLE_TH_H}
                px={TABLE_CELL_PX}
                py={3}
                bg={isFirefox ? "bg.bodySolid" : TABLE_TH_BG}
                backdropFilter={isFirefox ? "none" : BACKDROP_BLUR_FILTER}
                borderBottom={"1px solid"}
                borderColor={TABLE_TH_BORDER_COLOR}
                roundedRight={TABLE_ROW_ROUNDED}
                zIndex={4}
                pos={"sticky"}
                right={0}
                top={0}
                isolation={"isolate"}
              >
                {/* Row column spacer */}
              </HStack>
            )}
          </Box>

          {/* Body Rows */}
          {resolvedTableData?.map((row, rowIndex) => {
            const isRowSelected = selectedRows.includes(row.id);

            return (
              <Box
                display={"contents"}
                key={rowIndex}
                role={"group"}
                {...(trBodyProps as any)}
              >
                {/* Batch options column */}
                {!isEmptyArray(batchOptions) && (
                  <Center
                    position={"sticky"}
                    h={"full"}
                    minH={TABLE_TD_MIN_H}
                    px={"10px"}
                    minW={"0% !important"}
                    bg={
                      isRowSelected
                        ? SELECTED_BG
                        : isFirefox
                          ? "bg.bodySolid"
                          : TABLE_TD_BG
                    }
                    _before={
                      isFirefox
                        ? undefined
                        : {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            backdropFilter: BACKDROP_BLUR_FILTER,
                            zIndex: -1,
                          }
                    }
                    borderBottom={
                      rowIndex !== resolvedTableData.length - 1
                        ? "1px solid"
                        : ""
                    }
                    borderColor={
                      isRowSelected ? SELECTED_BG : TABLE_TD_BORDER_COLOR
                    }
                    roundedLeft={TABLE_ROW_ROUNDED}
                    left={0}
                    zIndex={2}
                    isolation={"isolate"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRowSelection(row);
                    }}
                    cursor={"pointer"}
                  >
                    <Checkbox
                      subtle={true}
                      size={"sm"}
                      colorPalette={themeConfig.colorPalette}
                      checked={selectedRows.includes(row.id)}
                    />
                  </Center>
                )}

                {/* Main columns */}
                {row.columns.map((col, colIndex) => (
                  <HStack
                    key={colIndex}
                    position={"relative"}
                    justify={col.align}
                    w={"full"}
                    h={"full"}
                    minH={TABLE_TD_MIN_H}
                    px={TABLE_CELL_PX}
                    py={TABLE_CELL_PY}
                    bg={
                      isRowSelected
                        ? SELECTED_BG
                        : isFirefox
                          ? "bg.bodySolid"
                          : TABLE_TD_BG
                    }
                    fontSize={"md"}
                    borderBottom={
                      rowIndex !== resolvedTableData.length - 1
                        ? "1px solid"
                        : ""
                    }
                    borderColor={
                      isRowSelected ? SELECTED_BG : TABLE_TD_BORDER_COLOR
                    }
                    _before={
                      isFirefox
                        ? undefined
                        : {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            backdropFilter: BACKDROP_BLUR_FILTER,
                            zIndex: -1,
                          }
                    }
                    whiteSpace={"nowrap"}
                    isolation={"isolate"}
                    {...col?.bodyProps}
                  >
                    <Box opacity={row.dim || col.dim ? 0.4 : 1} w={"full"}>
                      {col?.td}
                    </Box>
                  </HStack>
                ))}

                {/* Row options column */}
                {!isEmptyArray(rowOptions) && (
                  <Center
                    position={"sticky"}
                    h={"full"}
                    minH={TABLE_TD_MIN_H}
                    px={"10px"}
                    minW={"0% !important"}
                    bg={
                      isRowSelected
                        ? SELECTED_BG
                        : isFirefox
                          ? "bg.bodySolid"
                          : TABLE_TD_BG
                    }
                    _before={
                      isFirefox
                        ? undefined
                        : {
                            content: '""',
                            position: "absolute",
                            inset: 0,
                            backdropFilter: BACKDROP_BLUR_FILTER,
                            zIndex: -1,
                          }
                    }
                    borderBottom={
                      rowIndex !== resolvedTableData.length - 1
                        ? "1px solid"
                        : ""
                    }
                    borderColor={
                      isRowSelected ? SELECTED_BG : TABLE_TD_BORDER_COLOR
                    }
                    roundedRight={TABLE_ROW_ROUNDED}
                    right={0}
                    zIndex={2}
                    isolation={"isolate"}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <RowOptions
                      row={row}
                      rowOptions={rowOptions}
                      tableContainerRef={tableContainerRef}
                      color={"fg.ibody"}
                    />
                  </Center>
                )}
              </Box>
            );
          })}
        </Grid>
      </StackV>

      {hasFooter && (
        <DataFooter
          limit={limit}
          setLimit={setLimit}
          dataLength={rows?.length}
          totalData={totalData}
          page={page}
          setPage={setPage}
          totalPage={totalPage}
        />
      )}
    </StackV>
  );
};

// -----------------------------------------------------------------

export const DataTable = {
  Display: DataTableDisplay,
};
