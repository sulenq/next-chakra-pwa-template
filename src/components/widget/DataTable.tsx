import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { P } from "@/components/ui/p";
import { BatchOptions } from "@/components/widget/BatchOptions";
import { Limitation } from "@/components/widget/Limitation";
import { Pagination } from "@/components/widget/Pagination";
import { RowOptions } from "@/components/widget/RowOptions";
import { SortIcon } from "@/components/widget/SortIcon";
import { Interface__FormattedTableRow } from "@/constants/interfaces";
import { Props__DataTable } from "@/constants/props";
import { Type__SortHandler } from "@/constants/types";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { isEmptyArray } from "@/utils/array";
import { hexWithOpacity } from "@/utils/color";
import { Box, Center, HStack, Table } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";

export const DataTable = (props: Props__DataTable) => {
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
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Refs
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const iss = useIsSmScreenWidth();
  const dimensions = useContainerDimension(tableContainerRef);

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
  function toggleRowSelection(row: Interface__FormattedTableRow) {
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

  // SX
  const optionsCellWidth = "44px";
  const cellPx = 3;
  const thHeight = "46px";
  const thBg = "body";
  const thBorderColor = "border.subtle";
  const tdMinH = "46px";
  const tdBg = "body";
  const footerBorderColor = "border.subtle";
  const selectedColor =
    themeConfig.colorPalette === "gray"
      ? "d1"
      : hexWithOpacity(themeConfig.primaryColorHex, 0.05);
  const tdBorderColor = "d1";

  // set initial table data source of truth
  useEffect(() => {
    setTableData([...rows]);
  }, [rows]);

  return (
    <CContainer
      ref={tableContainerRef}
      flex={1}
      minH={props?.minH || dimensions?.height < 625 ? "400px" : ""}
      overflow={"auto"}
      {...restProps}
    >
      <CContainer
        className="scrollX scrollYAlt"
        flex={1}
        {...contentContainerProps}
      >
        <Table.Root
          w={headers.length > 1 ? "full" : "fit-content"}
          tableLayout={"auto"}
        >
          <Table.Header>
            <Table.Row
              position={"sticky"}
              top={0}
              zIndex={3}
              borderColor={thBorderColor}
            >
              {!isEmptyArray(batchOptions) && (
                <Table.ColumnHeader
                  h={thHeight}
                  w={optionsCellWidth}
                  maxW={optionsCellWidth}
                  minW={"0% !important"}
                  p={0}
                  position={"sticky"}
                  left={0}
                  borderBottom={"none !important"}
                >
                  <Center
                    h={thHeight}
                    px={"10px"}
                    borderBottom={"1px solid"}
                    borderColor={thBorderColor}
                    bg={thBg}
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

              {/* Number Column */}
              <Table.ColumnHeader
                whiteSpace={"nowrap"}
                borderBottom={"none !important"}
                p={0}
                w="1%"
                minW="fit-content"
                maxW="fit-content"
              >
                <HStack
                  h={thHeight}
                  bg={thBg}
                  px={cellPx}
                  py={3}
                  borderBottom={"1px solid"}
                  borderColor={thBorderColor}
                >
                  <P color={"fg.muted"}>No.</P>
                </HStack>
              </Table.ColumnHeader>

              {headers.map((header, idx) => (
                <Table.ColumnHeader
                  key={idx}
                  whiteSpace={"nowrap"}
                  onClick={header.sortable ? () => sort(idx) : undefined}
                  cursor={header.sortable ? "pointer" : "auto"}
                  borderBottom={"none !important"}
                  p={0}
                  {...header?.headerProps}
                >
                  <HStack
                    h={thHeight}
                    bg={thBg}
                    px={cellPx}
                    py={3}
                    pl={idx === 0 ? 4 : ""}
                    pr={
                      idx === headers.length - 1
                        ? 4
                        : (header?.wrapperProps?.justify === "center" ||
                              header?.wrapperProps?.justifyContent ===
                                "center") &&
                            header.sortable
                          ? 1
                          : ""
                    }
                    justify={header.align}
                    borderBottom={"1px solid"}
                    borderColor={thBorderColor}
                    {...header?.wrapperProps}
                  >
                    <P color={"fg.muted"}>{header?.th}</P>

                    {header.sortable && (
                      <SortIcon
                        columnIndex={idx}
                        sortColumnIdx={sortConfig.sortColumnIdx}
                        direction={sortConfig.direction}
                      />
                    )}
                  </HStack>
                </Table.ColumnHeader>
              ))}

              {!isEmptyArray(rowOptions) && (
                <Table.ColumnHeader
                  position={"sticky"}
                  right={"0px"}
                  w={optionsCellWidth}
                  maxW={optionsCellWidth}
                  p={0}
                  borderBottom={"none !important"}
                >
                  <HStack
                    h={thHeight}
                    bg={thBg}
                    px={cellPx}
                    pr={"18px"}
                    py={3}
                    borderBottom={"1px solid"}
                    borderColor={thBorderColor}
                    pos={"relative"}
                  >
                    {/* <Box
                      h={tdMinH}
                      w={"6px"}
                      bg={"body"}
                      pos={"absolute"}
                      right={"-6px"}
                    /> */}
                    {/* Row Actions !!! */}
                  </HStack>
                </Table.ColumnHeader>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {resolvedTableData?.map((row, rowIdx) => {
              const isRowSelected = selectedRows.includes(row.id);

              return (
                <Table.Row
                  key={rowIdx}
                  role="group"
                  px={2}
                  position={"relative"}
                  bg={"body"}
                  {...trBodyProps}
                >
                  {!isEmptyArray(batchOptions) && (
                    <Table.Cell
                      minW={"0% !important"}
                      maxW={optionsCellWidth}
                      w={optionsCellWidth}
                      h={tdMinH}
                      p={0}
                      position={"sticky"}
                      left={0}
                      bg={"body"}
                      zIndex={2}
                    >
                      <Center
                        h={tdMinH}
                        bg={isRowSelected ? selectedColor : tdBg}
                        px={"10px"}
                        cursor={"pointer"}
                        borderBottom={
                          rowIdx !== resolvedTableData.length - 1
                            ? "1px solid"
                            : ""
                        }
                        borderColor={
                          isRowSelected ? selectedColor : tdBorderColor
                        }
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

                  {/* Numbering Column */}
                  <Table.Cell whiteSpace={"nowrap"} p={0}>
                    <HStack
                      py={3}
                      px={cellPx}
                      h={tdMinH}
                      bg={isRowSelected ? selectedColor : tdBg}
                      borderBottom={
                        rowIdx !== resolvedTableData.length - 1
                          ? "1px solid"
                          : ""
                      }
                      borderColor={
                        isRowSelected ? selectedColor : tdBorderColor
                      }
                      fontSize={"md"}
                      color={"fg.subtle"}
                      justify={"center"}
                    >
                      {rowIdx + 1}
                    </HStack>
                  </Table.Cell>

                  {row.columns.map((col, colIndex) => (
                    <Table.Cell
                      key={colIndex}
                      whiteSpace={"nowrap"}
                      p={0}
                      fontSize={"md"}
                      {...col?.tableCellProps}
                    >
                      <HStack
                        py={3}
                        px={cellPx}
                        h={tdMinH}
                        bg={isRowSelected ? selectedColor : tdBg}
                        borderBottom={
                          rowIdx !== resolvedTableData.length - 1
                            ? "1px solid"
                            : ""
                        }
                        borderColor={
                          isRowSelected ? selectedColor : tdBorderColor
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

                  {!isEmptyArray(rowOptions) && (
                    <Table.Cell
                      minW={"0% !important"}
                      w={optionsCellWidth}
                      maxW={optionsCellWidth}
                      h={tdMinH}
                      bg={"body"}
                      p={0}
                      position={"sticky"}
                      right={"0"}
                      zIndex={2}
                    >
                      <Center
                        h={tdMinH}
                        px={"10px"}
                        bg={isRowSelected ? selectedColor : tdBg}
                        borderBottom={
                          rowIdx !== resolvedTableData.length - 1
                            ? "1px solid"
                            : ""
                        }
                        borderColor={
                          isRowSelected ? selectedColor : tdBorderColor
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        pos={"relative"}
                      >
                        {/* <Box
                          h={tdMinH}
                          w={"6px"}
                          bg={"body"}
                          pos={"absolute"}
                          right={"-6px"}
                        /> */}

                        <RowOptions
                          row={row}
                          rowOptions={rowOptions}
                          tableContainerRef={tableContainerRef}
                          color={"ibody"}
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

      {hasFooter && (
        <>
          <HStack
            p={2}
            borderTop={"1px solid"}
            borderColor={footerBorderColor}
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
