import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { P } from "@/components/ui/p";
import { BatchOptions } from "@/components/widgets/batch-option";
import { Limitation } from "@/components/widgets/limitation";
import { Pagination } from "@/components/widgets/pagination";
import { RowOptions } from "@/components/widgets/row-options";
import { SortIcon } from "@/components/widgets/sort-icon";
import {
  BatchOptionsTableOptionGenerator,
  FormattedTableHeader,
  FormattedTableRow,
  RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import { GAP, R_SPACING_MD } from "@/constants/styles";
import { Type__SortHandler } from "@/constants/types";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { useScreen } from "@/hooks/useScreen";
import { isEmptyArray } from "@/utils/array";
import { hexWithOpacity } from "@/utils/color";
import {
  Box,
  Center,
  HStack,
  StackProps,
  Table,
  TableRowProps,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

const OPTIONS_CELL_W = "46px";
const CELL_PX = 3;

const TABLE_CONTAINER_BG = "transparent";
const TABLE_ROW_BG = "transparent";

const TH_H = "45px";
const TH_PB = GAP;
const TH_BG = "bg.frosted";
const TH_BORDER_COLOR = "transparent";

const TD_MIN_H = "46px";
const TD_BG = "bg.body";
const TD_BORDER_COLOR = "transparent";

const FOOTER_BORDER_COLOR = "border.muted";

export interface DataTableProps extends Omit<StackProps, "page"> {
  trBodyProps?: TableRowProps;
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
  footer?: any;
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
    footer,
    contentContainerProps,
    p,
    pl = R_SPACING_MD,
    pr = R_SPACING_MD,
    pt,
    pb,
    px,
    py,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Refs
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const iss = useIsSmScreenWidth();
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
  const selectedColor =
    themeConfig.colorPalette === "gray"
      ? "border.subtle"
      : hexWithOpacity(themeConfig.primaryColorHex, 0.05);
  const TABLE_ROW_ROUNDED = 0;

  return (
    <CContainer
      ref={tableContainerRef}
      flex={1}
      minH={props?.minH || sh < 625 ? "400px" : ""}
      overflow={"auto"}
      {...restProps}
    >
      <CContainer pt={R_SPACING_MD} overflow={"auto"}>
        <CContainer
          className={"scrollX scrollYAlt"}
          flex={1}
          px={R_SPACING_MD}
          pb={R_SPACING_MD}
          bg={TABLE_CONTAINER_BG}
          {...contentContainerProps}
        >
          <Table.Root
            w={headers.length > 1 ? "full" : "fit-content"}
            // borderCollapse={"separate"}
            borderSpacing={`0 ${GAP}`}
          >
            <Table.Header>
              <Table.Row
                bg={TABLE_ROW_BG}
                overflow={"clip"}
                position={"sticky"}
                top={0}
                zIndex={3}
              >
                {!isEmptyArray(batchOptions) && (
                  <Table.ColumnHeader
                    h={TH_H}
                    w={OPTIONS_CELL_W}
                    maxW={OPTIONS_CELL_W}
                    minW={"0% !important"}
                    p={0}
                    pb={TH_PB}
                    borderBottom={"none !important"}
                    position={"sticky"}
                    left={0}
                  >
                    <Center
                      h={TH_H}
                      px={"10px"}
                      pl={pl}
                      bg={TH_BG}
                      borderBottom={"1px solid"}
                      borderColor={TH_BORDER_COLOR}
                      roundedLeft={TABLE_ROW_ROUNDED}
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
                  </Table.ColumnHeader>
                )}

                {/* Numbering column */}
                <Table.ColumnHeader
                  whiteSpace={"nowrap"}
                  minW={"fit-content"}
                  w={"1%"}
                  maxW={"fit-content"}
                  p={0}
                  pb={TH_PB}
                  borderBottom={"none !important"}
                >
                  <HStack
                    h={TH_H}
                    px={CELL_PX}
                    py={3}
                    bg={TH_BG}
                    borderBottom={"1px solid"}
                    borderColor={TH_BORDER_COLOR}
                  >
                    <P fontWeight={"medium"} color={"fg.muted"}>
                      No.
                    </P>
                  </HStack>
                </Table.ColumnHeader>

                {/* Main columns */}
                {headers.map((header, index) => (
                  <Table.ColumnHeader
                    key={index}
                    whiteSpace={"nowrap"}
                    p={0}
                    pb={TH_PB}
                    borderBottom={"none !important"}
                    cursor={header.sortable ? "pointer" : "auto"}
                    onClick={header.sortable ? () => sort(index) : undefined}
                    {...header?.headerProps}
                  >
                    <HStack
                      justify={header.align}
                      h={TH_H}
                      px={CELL_PX}
                      py={3}
                      pl={index === 0 ? 4 : ""}
                      pr={
                        index === headers.length - 1
                          ? 4
                          : (header?.wrapperProps?.justify === "center" ||
                                header?.wrapperProps?.justifyContent ===
                                  "center") &&
                              header.sortable
                            ? 1
                            : ""
                      }
                      bg={TH_BG}
                      borderBottom={"1px solid"}
                      borderColor={TH_BORDER_COLOR}
                      {...header?.wrapperProps}
                    >
                      <P fontWeight={"medium"} color={"fg.muted"}>
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
                  </Table.ColumnHeader>
                ))}

                {/* Row options column */}
                {!isEmptyArray(rowOptions) && (
                  <Table.ColumnHeader
                    w={OPTIONS_CELL_W}
                    maxW={OPTIONS_CELL_W}
                    p={0}
                    pb={TH_PB}
                    borderBottom={"none !important"}
                    position={"sticky"}
                    right={"0px"}
                  >
                    <HStack
                      h={TH_H}
                      px={CELL_PX}
                      pr={pr}
                      py={3}
                      bg={TH_BG}
                      borderBottom={"1px solid"}
                      borderColor={TH_BORDER_COLOR}
                      roundedRight={TABLE_ROW_ROUNDED}
                      pos={"relative"}
                    >
                      {/* Row column spacer */}
                    </HStack>
                  </Table.ColumnHeader>
                )}
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {resolvedTableData?.map((row, rowIndex) => {
                const isRowSelected = selectedRows.includes(row.id);
                const isLastIndex = rowIndex === resolvedTableData.length - 1;

                return (
                  <Table.Row
                    key={rowIndex}
                    role={"group"}
                    bg={TABLE_ROW_BG}
                    overflow={"clip"}
                    position={"relative"}
                    {...trBodyProps}
                  >
                    {/* Batch options column */}
                    {!isEmptyArray(batchOptions) && (
                      <Table.Cell
                        minW={"0% !important"}
                        maxW={OPTIONS_CELL_W}
                        w={OPTIONS_CELL_W}
                        h={TD_MIN_H}
                        p={0}
                        pb={isLastIndex ? 0 : GAP}
                        position={"sticky"}
                        left={0}
                        zIndex={2}
                      >
                        <Center
                          h={TD_MIN_H}
                          bg={isRowSelected ? selectedColor : TD_BG}
                          px={"10px"}
                          pl={pl}
                          cursor={"pointer"}
                          borderBottom={
                            rowIndex !== resolvedTableData.length - 1
                              ? "1px solid"
                              : ""
                          }
                          borderColor={
                            isRowSelected ? selectedColor : TD_BORDER_COLOR
                          }
                          roundedLeft={TABLE_ROW_ROUNDED}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleRowSelection(row);
                          }}
                        >
                          <Checkbox
                            subtle
                            size={"sm"}
                            colorPalette={themeConfig.colorPalette}
                            checked={selectedRows.includes(row.id)}
                          />
                        </Center>
                      </Table.Cell>
                    )}

                    {/* Numbering column */}
                    <Table.Cell
                      whiteSpace={"nowrap"}
                      p={0}
                      pb={isLastIndex ? 0 : GAP}
                    >
                      <HStack
                        py={3}
                        px={CELL_PX}
                        h={TD_MIN_H}
                        bg={isRowSelected ? selectedColor : TD_BG}
                        borderBottom={
                          rowIndex !== resolvedTableData.length - 1
                            ? "1px solid"
                            : ""
                        }
                        borderColor={
                          isRowSelected ? selectedColor : TD_BORDER_COLOR
                        }
                        fontSize={"md"}
                        color={"fg.subtle"}
                        justify={"center"}
                      >
                        {rowIndex + 1}
                      </HStack>
                    </Table.Cell>

                    {/* Main columns */}
                    {row.columns.map((col, colIndex) => (
                      <Table.Cell
                        key={colIndex}
                        whiteSpace={"nowrap"}
                        p={0}
                        pb={isLastIndex ? 0 : GAP}
                        fontSize={"md"}
                        {...col?.tableCellProps}
                      >
                        <HStack
                          py={3}
                          px={CELL_PX}
                          h={TD_MIN_H}
                          bg={isRowSelected ? selectedColor : TD_BG}
                          borderBottom={
                            rowIndex !== resolvedTableData.length - 1
                              ? "1px solid"
                              : ""
                          }
                          borderColor={
                            isRowSelected ? selectedColor : TD_BORDER_COLOR
                          }
                          justify={col.align}
                          {...col?.wrapperProps}
                        >
                          <Box opacity={row.dim || col.dim ? 0.4 : 1} w="full">
                            {col?.td}
                          </Box>
                        </HStack>
                      </Table.Cell>
                    ))}

                    {/* Row options column */}
                    {!isEmptyArray(rowOptions) && (
                      <Table.Cell
                        minW={"0% !important"}
                        w={OPTIONS_CELL_W}
                        maxW={OPTIONS_CELL_W}
                        h={TD_MIN_H}
                        p={0}
                        pb={isLastIndex ? 0 : GAP}
                        position={"sticky"}
                        right={"0"}
                        zIndex={2}
                      >
                        <Center
                          h={TD_MIN_H}
                          px={"10px"}
                          pr={pr}
                          bg={isRowSelected ? selectedColor : TD_BG}
                          borderBottom={
                            rowIndex !== resolvedTableData.length - 1
                              ? "1px solid"
                              : ""
                          }
                          borderColor={
                            isRowSelected ? selectedColor : TD_BORDER_COLOR
                          }
                          roundedRight={TABLE_ROW_ROUNDED}
                          pos={"relative"}
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
                      </Table.Cell>
                    )}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        </CContainer>
      </CContainer>

      {hasFooter && (
        <>
          <HStack
            // h={footerH}
            p={3}
            borderTop={"1px solid"}
            borderColor={FOOTER_BORDER_COLOR}
            justify={"space-between"}
            wrap={"wrap"}
          >
            <CContainer w={"fit"} mb={[1, null, 0]}>
              <Limitation limit={limit} setLimit={setLimit} />
            </CContainer>

            {!iss && (
              <CContainer
                w={"fit"}
                justify={"center"}
                pl={[2, null, 0]}
                mt={[footer ? 1 : 0, null, 0]}
              >
                {footer}
              </CContainer>
            )}

            <CContainer w={"fit"}>
              <Pagination page={page} setPage={setPage} totalPage={totalPage} />
            </CContainer>
          </HStack>

          {iss && (
            <CContainer
              w={"fit"}
              justify={"center"}
              pl={[2, null, 0]}
              mt={[footer ? 1 : 0, null, 0]}
            >
              {footer}
            </CContainer>
          )}
        </>
      )}
    </CContainer>
  );
};

export const DataTable = {
  Display: DataTableDisplay,
};
