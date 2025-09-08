import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { SortIcon } from "@/components/widget/SortIcon";
import { Props__DataTable, Props_RowOptions } from "@/constants/props";
import { Type__SortHandler } from "@/constants/types";
import useConfirmationDisclosure from "@/context/disclosure/useConfirmationDisclosure";
import useScreen from "@/hooks/useScreen";
import { isEmptyArray } from "@/utils/array";
import { Center, HStack, Icon, Table } from "@chakra-ui/react";
import { IconDots } from "@tabler/icons-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";

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
          <Icon fontSize={"lg !important"}>
            <IconDots />
          </Icon>
        </Btn>
      </MenuTrigger>

      <MenuContent portalRef={tableContainerRef} zIndex={2} minW={"140px"}>
        {rowOptions?.map((option, idx) => {
          if (option === "divider") return <MenuSeparator key={idx} />;

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
                justifyContent={"space-between"}
                color={"light"}
                disabled={disabled}
                onClick={() => {
                  handleConfirmationClick(option);
                }}
                {...menuItemProps}
              >
                {label}
                {icon}
              </MenuItem>
            );
          }

          if (override) {
            return <Fragment key={idx}>{override?.(row)}</Fragment>;
          }

          return (
            <MenuItem
              key={idx}
              value={label}
              color={"light"}
              onClick={() => {
                onClick?.(row);
              }}
              justifyContent={"space-between"}
              disabled={disabled}
              {...menuItemProps}
            >
              {label}
              {icon}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
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
    page = 1,
    setPage,
    limit = 15,
    setLimit,
    ...restProps
  } = props;

  // Hooks
  const { sh } = useScreen();

  // Refs
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [tableData, setTableData] = useState(rows);
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

  // SX
  const thHeight = "48px";
  const thWidth = "52.4px";
  const thBg = "body";
  const borderColor = "border.subtle";

  // set initial source of truth table data
  useEffect(() => {
    setTableData([...rows]);
  }, []);

  return (
    <CContainer
      ref={tableContainerRef}
      className="scrollX scrollY"
      borderColor={"border.muted"}
      minH={props?.minH || sh < 625 ? "400px" : "full"}
      flex={1}
      flexShrink={0}
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
            zIndex={3}
            borderColor={borderColor}
          >
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
                  <P color={"fg.muted"} fontWeight={"semibold"}>
                    {header?.th}
                  </P>

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
                {/* Numbering Column */}
                <Table.Cell whiteSpace={"nowrap"} p={0}>
                  <HStack
                    py={3}
                    px={4}
                    h={"48px"}
                    borderBottom={
                      rowIdx !== resolvedTableData.length - 1 ? "1px solid" : ""
                    }
                    borderColor={borderColor}
                  >
                    {rowIdx + 1}
                  </HStack>
                </Table.Cell>

                {row.columns.map((col, colIndex) => (
                  <Table.Cell
                    key={colIndex}
                    whiteSpace={"nowrap"}
                    p={0}
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
  );
};
