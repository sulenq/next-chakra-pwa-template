import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { DotIndicator } from "@/components/widget/Indicator";
import { SortIcon } from "@/components/widget/SortIcon";
import { Interface__FormattedTableData } from "@/constants/interfaces";
import {
  Props__BatchOptions,
  Props__DataTable,
  Props_LimitationTableData,
  Props_PaginationTableData,
  Props_RowOptions,
} from "@/constants/props";
import { Type__SortHandler } from "@/constants/types";
import useConfirmationDisclosure from "@/context/disclosure/useConfirmationDisclosure";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import useScreen from "@/hooks/useScreen";
import { isEmptyArray } from "@/utils/array";
import { formatNumber } from "@/utils/formatter";
import { Center, HStack, Icon, Table } from "@chakra-ui/react";
import {
  IconCaretDownFilled,
  IconCaretLeftFilled,
  IconCaretRightFilled,
  IconDots,
  IconMenu,
} from "@tabler/icons-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

const ICON_BOX_SIZE = "18px";

const RowOptions = (props: Props_RowOptions) => {
  // Props
  const { row, rowOptions, tableContainerRef } = props;

  // Contexts
  const { setConfirmationData, confirmationOnOpen } =
    useConfirmationDisclosure();

  // Utils
  function handleConfirmationClick(option: any) {
    setConfirmationData({
      id: option.confirmation(row).id,
      title: option.confirmation(row).title,
      description: option.confirmation(row).description,
      confirmLabel: option.confirmation(row).confirmLabel,
      onConfirm: option.confirmation(row).onConfirm,
      confirmButtonProps: option.confirmation(row).confirmButtonProps,
      loading: option.confirmation(row).loading,
    });
    confirmationOnOpen();
  }

  return (
    <MenuRoot lazyMount>
      <MenuTrigger asChild aria-label="row options">
        <Btn iconButton clicky={false} variant={"ghost"} size={"xs"}>
          <Icon boxSize={5}>
            <IconDots />
          </Icon>
        </Btn>
      </MenuTrigger>

      <MenuContent portalRef={tableContainerRef} zIndex={2} minW={"140px"}>
        {rowOptions?.map((item, idx) => {
          // if (item === "divider") return <MenuSeparator key={idx} />;

          const option = item(row);
          if (!option) return null;

          const {
            disabled = false,
            label = "",
            icon,
            onClick = () => {},
            confirmation,
            menuItemProps,
            override,
          } = option;

          if (confirmation) {
            return (
              <MenuItem
                key={idx}
                value={label}
                justifyContent="space-between"
                disabled={disabled}
                onClick={() => {
                  if (!disabled) handleConfirmationClick(option);
                }}
                {...menuItemProps}
              >
                {label}
                {icon && <Icon boxSize={ICON_BOX_SIZE}>{icon}</Icon>}
              </MenuItem>
            );
          }

          if (override) {
            return <Fragment key={idx}>{override}</Fragment>;
          }

          return (
            <MenuItem
              key={idx}
              disabled={disabled}
              value={label}
              onClick={() => {
                if (!disabled) onClick();
              }}
              justifyContent="space-between"
              {...menuItemProps}
            >
              {label}
              {icon && <Icon boxSize={ICON_BOX_SIZE}>{icon}</Icon>}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
const BatchOptions = (props: Props__BatchOptions) => {
  // Props
  const {
    selectedRows,
    batchOptions,
    selectAllRows,
    handleSelectAllRows,
    tableContainerRef,
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const { setConfirmationData, confirmationOnOpen } =
    useConfirmationDisclosure();

  // Utils
  function handleConfirmationClick(option: any) {
    setConfirmationData({
      id: option.confirmation(selectedRows).id,
      title: option.confirmation(selectedRows).title,
      description: option.confirmation(selectedRows).description,
      confirmLabel: option.confirmation(selectedRows).confirmLabel,
      onConfirm: option.confirmation(selectedRows).onConfirm,
      confirmButtonProps: option.confirmation(selectedRows).confirmButtonProps,
    });
    confirmationOnOpen();
  }

  return (
    <MenuRoot lazyMount closeOnSelect={false}>
      <MenuTrigger asChild aria-label="batch options">
        <Btn iconButton clicky={false} variant={"ghost"} size={"xs"}>
          <Icon>
            <IconMenu />
          </Icon>
        </Btn>
      </MenuTrigger>

      <MenuContent portalRef={tableContainerRef} zIndex={10} minW={"140px"}>
        <CContainer px={3} py={1}>
          <P fontSize={"sm"} opacity={0.5} fontWeight={500}>
            {`${selectedRows.length} ${l.selected.toLowerCase()}`}
          </P>
        </CContainer>

        <MenuItem
          value={"select all"}
          justifyContent={"space-between"}
          onClick={() => {
            handleSelectAllRows(selectAllRows);
          }}
          closeOnSelect={false}
        >
          <P>{l.select_all}</P>

          <DotIndicator
            color={selectAllRows ? themeConfig.primaryColor : "d3"}
            mr={1}
          />
        </MenuItem>

        <MenuSeparator />

        {batchOptions?.map((item, idx) => {
          const noSelection = selectedRows.length === 0;

          // if (item === "divider") return <MenuSeparator key={idx} />;

          const option = item(selectedRows);
          if (!option) return null;

          const {
            disabled = false,
            label = "",
            icon,
            onClick = () => {},
            confirmation,
            menuItemProps,
            override,
          } = option;

          const resolvedDisabled = noSelection || disabled;

          if (confirmation) {
            return (
              <MenuItem
                key={idx}
                value={label}
                justifyContent="space-between"
                disabled={resolvedDisabled}
                onClick={() => {
                  if (!resolvedDisabled) handleConfirmationClick(option);
                }}
                {...menuItemProps}
              >
                {label}
                {icon && <Icon boxSize={ICON_BOX_SIZE}>{icon}</Icon>}
              </MenuItem>
            );
          }

          if (override) {
            return <Fragment key={idx}>{override}</Fragment>;
          }

          return (
            <MenuItem
              key={idx}
              value={label}
              onClick={() => {
                if (!resolvedDisabled) onClick();
              }}
              disabled={resolvedDisabled}
              justifyContent="space-between"
              {...menuItemProps}
            >
              {label}
              {icon && <Icon boxSize={ICON_BOX_SIZE}>{icon}</Icon>}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
const Limittation = (props: Props_LimitationTableData) => {
  // Props
  const { limit, setLimit } = props;

  // Contexts
  const { l } = useLang();

  // States
  const limitOptions = [15, 30, 50, 100];

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <Btn clicky={false} size={"xs"} variant={"ghost"} pr={"8px"}>
          <HStack>
            <P>{l.show}</P>
            <P>{`${limit}`}</P>
          </HStack>

          <Icon boxSize={4} ml={1} color={"fg.subtle"}>
            <IconCaretDownFilled />
          </Icon>
        </Btn>
      </MenuTrigger>

      <MenuContent w={"120px"}>
        {limitOptions.map((l) => {
          const isActive = limit === l;

          return (
            <MenuItem
              key={l}
              value={`${l}`}
              onClick={() => {
                setLimit(l);
              }}
              justifyContent={"space-between"}
            >
              {l}
              {isActive && <DotIndicator mr={1} />}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
const Pagination = (props: Props_PaginationTableData) => {
  // Props
  const { page, setPage, totalPage } = props;

  // Contexts
  const { l } = useLang();

  // States
  const [pageTemp, setPageTemp] = useState<number | null | undefined>(page);
  const isFirstPage = pageTemp === 1;
  const isLastPage = pageTemp === (totalPage || 1);

  // Utils
  function handlePrev() {
    if (page > 1) setPageTemp((ps) => ps! + 1);
  }
  function handleNext() {
    if (page < (totalPage || 1)) setPageTemp((ps) => ps! - 1);
  }

  // debounce setPage
  useEffect(() => {
    if (pageTemp) setPage(pageTemp);
  }, [pageTemp]);

  return (
    <HStack gap={2}>
      <Btn
        iconButton
        clicky={false}
        size={"xs"}
        variant={"ghost"}
        onClick={handlePrev}
        disabled={isFirstPage}
      >
        <Icon>
          <IconCaretLeftFilled />
        </Icon>
      </Btn>

      <HStack whiteSpace={"nowrap"}>
        <P>{formatNumber(page)}</P>

        <P>{l.of}</P>

        <P>{formatNumber(totalPage) || "?"}</P>
      </HStack>

      <Btn
        iconButton
        clicky={false}
        size={"xs"}
        variant={"ghost"}
        onClick={handleNext}
        disabled={isLastPage}
      >
        <Icon>
          <IconCaretRightFilled />
        </Icon>
      </Btn>
    </HStack>
  );
};

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
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();
  const { sh } = useScreen();

  // Refs
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // States
  const [tableData, setTableData] = useState(rows);
  const [selectAllRows, setSelectAllRows] = useState<boolean>(false);
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
  const hasTableFooter = limit && setLimit && page && setPage;

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
    setSelectAllRows(!selectAllRows);
    if (!isChecked) {
      const allIds = tableData.map((row) => row.id);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  }
  function toggleRowSelection(row: Interface__FormattedTableData) {
    const rowId = row.id;
    setSelectedRows((ps) => {
      const isSelected = ps.includes(rowId);

      if (isSelected) {
        setSelectAllRows(false);
        return ps.filter((id) => id !== rowId);
      } else {
        if (tableData.length === selectedRows.length + 1) {
          setSelectAllRows(true);
        }
        return [...ps, rowId];
      }
    });
  }

  // SX
  const thHeight = "48px";
  const thWidth = "52.4px";
  const thBg = "body";
  const borderColor = "border.subtle";

  // set initial source of truth table data
  useEffect(() => {
    setTableData([...rows]);
  }, [rows]);

  return (
    <>
      <CContainer
        ref={tableContainerRef}
        className="scrollX scrollY"
        borderColor={"border.muted"}
        minH={props?.minH || sh < 625 ? "400px" : ""}
        flex={1}
        {...restProps}
      >
        <Table.Root
          w={headers.length > 1 ? "full" : "fit-content"}
          tableLayout={"auto"}
        >
          <Table.Header>
            <Table.Row
              position={"sticky"}
              top={0}
              zIndex={2}
              borderColor={borderColor}
            >
              {!isEmptyArray(batchOptions) && (
                <Table.ColumnHeader
                  h={thHeight}
                  w={thWidth}
                  minW={"0% !important"}
                  p={0}
                  position={"sticky"}
                  left={0}
                  zIndex={10}
                  borderBottom={"none !important"}
                >
                  <Center
                    h={thHeight}
                    px={"10px"}
                    borderBottom={"1px solid"}
                    borderColor={borderColor}
                    bg={thBg}
                  >
                    <BatchOptions
                      selectedRows={selectedRows}
                      batchOptions={batchOptions}
                      selectAllRows={selectAllRows}
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
                  px={4}
                  py={3}
                  borderBottom={"1px solid"}
                  borderColor={borderColor}
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
                    px={4}
                    py={3}
                    pl={idx === 0 ? 4 : ""}
                    pr={idx === headers.length - 1 ? 4 : ""}
                    borderBottom={"1px solid"}
                    borderColor={borderColor}
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
                  w={thWidth}
                  p={0}
                  borderBottom={"none !important"}
                >
                  <HStack
                    h={thHeight}
                    bg={thBg}
                    px={4}
                    pr={"18px"}
                    py={3}
                    borderBottom={"1px solid"}
                    borderColor={borderColor}
                  >
                    {/* Row Actions !!! */}
                  </HStack>
                </Table.ColumnHeader>
              )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {resolvedTableData?.map((row, rowIdx) => {
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
                      h={"48px"}
                      p={0}
                      position={"sticky"}
                      left={0}
                      bg={"body"}
                      zIndex={2}
                    >
                      <Center
                        h={"48px"}
                        px={"10px"}
                        cursor={"pointer"}
                        borderBottom={
                          rowIdx !== resolvedTableData.length - 1
                            ? "1px solid"
                            : ""
                        }
                        borderColor={borderColor}
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
                          zIndex={-1}
                        />
                      </Center>
                    </Table.Cell>
                  )}

                  {/* Numbering Column */}
                  <Table.Cell whiteSpace={"nowrap"} p={0}>
                    <HStack
                      py={3}
                      px={4}
                      h={"48px"}
                      borderBottom={
                        rowIdx !== resolvedTableData.length - 1
                          ? "1px solid"
                          : ""
                      }
                      borderColor={borderColor}
                      fontSize={"md"}
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
                        px={4}
                        h={"48px"}
                        borderBottom={
                          rowIdx !== resolvedTableData.length - 1
                            ? "1px solid"
                            : ""
                        }
                        borderColor={borderColor}
                        {...col?.wrapperProps}
                      >
                        {col?.td}
                      </HStack>
                    </Table.Cell>
                  ))}

                  {!isEmptyArray(rowOptions) && (
                    <Table.Cell
                      minW={"0% !important"}
                      h={"48px"}
                      p={0}
                      position={"sticky"}
                      right={"0px"}
                      bg={"body"}
                      zIndex={2}
                    >
                      <Center
                        h={"48px"}
                        px={"10px"}
                        borderBottom={
                          rowIdx !== resolvedTableData.length - 1
                            ? "1px solid"
                            : ""
                        }
                        borderColor={borderColor}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <RowOptions
                          row={row}
                          rowOptions={rowOptions}
                          tableContainerRef={tableContainerRef}
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

      {hasTableFooter && (
        <>
          <HStack
            p={3}
            borderTop={"1px solid"}
            borderColor={"border.muted"}
            justify={"space-between"}
          >
            <CContainer w={"fit"} mb={[1, null, 0]}>
              <Limittation limit={limit} setLimit={setLimit} />
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
    </>
  );
};
