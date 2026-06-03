"use client";

import { BatchOptions } from "@/components/data-list/batch-option";
import { DataListFooter } from "@/components/data-list/data-footer";
import {
  RowOptions,
  RowOptionsProps,
} from "@/components/data-list/row-options";
import FeedbackNotFound from "@/components/feedback/feedback-not-found";
import { ImgViewer } from "@/components/media/img-viewer";
import { BackButton } from "@/components/navigation/back-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { Img } from "@/components/ui/img";
import { P, TNum } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackH, StackV } from "@/components/ui/stack";
import {
  BACKDROP_BLUR_FILTER,
  GAP,
  GRID_BATCH_OPTIONS_CONTAINER_BG,
  R_SPACING_MD,
} from "@/constants/styles";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import {
  BatchOptionsTableOptionGenerator,
  FormattedTableHeader,
  FormattedTableRow,
  RowOptionsTableOptionGenerator,
} from "@/types/global.types";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { imgUrl } from "@/utils/url";
import { Box, Presence, SimpleGrid, StackProps } from "@chakra-ui/react";
import React, {
  createContext,
  Dispatch,
  Fragment,
  SetStateAction,
  useContext,
  useState,
} from "react";

// -----------------------------------------------------------------

export interface DataGridItemProps extends StackProps {
  id: string;
  dim?: boolean;
}

export const DataGridItem = (props: DataGridItemProps) => {
  // Props
  const { children, id, dim, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();
  const { selectedRows, toggleRowSelection } = useDataGridContext();

  // Constants
  const selectedColor = `${theme.colorPalette}.solid`;
  const isRowSelected = selectedRows.includes(id);

  return (
    <StackV
      key={id}
      flex={1}
      bg={"bg.body"}
      border={"1px solid"}
      borderColor={isRowSelected ? selectedColor : "transparent"}
      rounded={theme.radii.component}
      opacity={dim ? 0.4 : 1}
      overflow={"clip"}
      pos={"relative"}
      {...restProps}
    >
      <Box
        pos={"absolute"}
        top={3}
        right={3}
        onClick={(e) => {
          e.stopPropagation();
          toggleRowSelection(id);
        }}
      >
        <Checkbox
          checked={isRowSelected}
          subtle
          bg={"grey.muted"}
          borderColor={"border.emphasized"}
          zIndex={2}
        />
      </Box>

      {children}
    </StackV>
  );
};

// -----------------------------------------------------------------

export interface DataGridDetailDisclosureProps extends StackProps {
  open: boolean;
  details: any;
}

const DataGridDetailContent = (props: DataGridDetailDisclosureProps) => {
  // Props
  const { open, details } = props;

  // States
  const [search, setSearch] = useState<string>("");
  const resolvedDetails = details?.filter((detail: any) => {
    return detail?.label?.toLowerCase()?.includes(search?.toLowerCase());
  });

  return (
    <Disclosure.Root open={open} lazyLoad size={"xs"}>
      <Disclosure.Content>
        <Disclosure.Header>
          <Disclosure.HeaderContent title={`Detail`} />
        </Disclosure.Header>

        <Disclosure.Body pb={2}>
          <StackV mb={2}>
            <SearchInput
              queryKey={"q-data-grid-detail"}
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue);
              }}
            />
          </StackV>

          <StackV>
            {details && (
              <>
                {isEmptyArray(resolvedDetails) && <FeedbackNotFound />}

                {resolvedDetails?.map((detail: any, index: number) => {
                  const isLast = index === resolvedDetails.length - 1;

                  return (
                    <StackV
                      key={index}
                      gap={2}
                      px={1}
                      pt={2}
                      pb={3}
                      borderBottom={!isLast ? "1px solid" : ""}
                      borderColor={"border.subtle"}
                      align={"start"}
                    >
                      <P fontWeight={"medium"} color={"fg.subtle"}>
                        {detail.label}
                      </P>

                      {detail.render}
                    </StackV>
                  );
                })}
              </>
            )}
          </StackV>
        </Disclosure.Body>

        <Disclosure.Footer>
          <BackButton />
        </Disclosure.Footer>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};

// -----------------------------------------------------------------

export interface DataGridDetailDisclosureTriggerProps extends StackProps {
  id: string;
  details: {
    label: string;
    render: any;
  }[];
}

const DataGridDetailTrigger = (props: DataGridDetailDisclosureTriggerProps) => {
  // Props
  const { children, id, details, ...restProps } = props;

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(`data-grid-detail-${id}`),
  );

  return (
    <>
      <StackV onClick={onOpen} {...restProps}>
        {children}
      </StackV>

      <DataGridDetailContent open={open} details={details} />
    </>
  );
};

// -----------------------------------------------------------------

export interface DataGridRowOptionsProps extends RowOptionsProps {
  row: FormattedTableRow;
  rowOptions?: RowOptionsTableOptionGenerator[];
}

const DataGridRowOptions = (props: DataGridRowOptionsProps) => {
  // Props
  const { row, rowOptions, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  if (rowOptions)
    return (
      <RowOptions
        row={row}
        rowOptions={rowOptions}
        size={"sm"}
        variant={"ghost"}
        rounded={theme.radii.component}
        menuRootProps={{
          positioning: {
            offset: {
              mainAxis: 16, // px
            },
          },
        }}
        {...restProps}
      />
    );
};

// -----------------------------------------------------------------

export interface DataGridContextValue {
  selectedRows: string[];
  toggleRowSelection: (id: string) => void;
}

const DataGridContext = createContext<DataGridContextValue | undefined>(
  undefined,
);

const useDataGridContext = () => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error(
      "useDataGridContext components must be wrapped in DataGrid.Root",
    );
  }
  return context;
};

// -----------------------------------------------------------------

export interface GridItemCallbackProps {
  row: FormattedTableRow;
  index: number;
  details: any;
}

export interface DataGridRootProps extends Omit<StackProps, "page"> {
  headers?: FormattedTableHeader[];
  rows?: FormattedTableRow[];
  batchOptions?: BatchOptionsTableOptionGenerator[];
  gridItem: (props: GridItemCallbackProps) => React.ReactNode;
  limit?: number;
  setLimit?: Dispatch<SetStateAction<number>>;
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  totalPage?: number;
  totalData?: number;
  minChildWidth?: string; // px
}

const DataGridRoot = (props: DataGridRootProps) => {
  // Props
  const {
    headers,
    rows,
    batchOptions,
    limit,
    setLimit,
    page,
    setPage,
    totalPage,
    totalData,
    minChildWidth = "180px",
    ...restProps
  } = props;

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // States
  const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Derived Values
  const hasFooter = limit && setLimit && page && setPage;
  const shouldShowBatch = batchOptions && !isEmptyArray(selectedRows);

  // Utils
  function handleSelectAllRows(isChecked: boolean) {
    setAllRowsSelected(!allRowsSelected);
    if (!isChecked) {
      const allIds = rows?.map((row) => `${row.id}`);
      setSelectedRows(allIds || []);
    } else {
      setSelectedRows([]);
    }
  }
  function handleClearSelectedRows() {
    setAllRowsSelected(false);
    setSelectedRows([]);
  }
  function toggleRowSelection(id: string) {
    setSelectedRows((ps) => {
      const isSelected = ps.includes(id);

      if (isSelected) {
        setAllRowsSelected(false);
        return ps.filter((pid) => pid !== id);
      } else {
        if (rows?.length === selectedRows.length + 1) {
          setAllRowsSelected(true);
        }
        return [...ps, id];
      }
    });
  }

  return (
    <DataGridContext.Provider
      value={{
        selectedRows,
        toggleRowSelection,
      }}
    >
      <StackV flex={1} overflowY={"auto"} pos={"relative"} {...restProps}>
        {/* Batch Options */}
        <Presence
          present={shouldShowBatch}
          animationName={{ _open: "fade-in", _closed: "fade-out" }}
          animationDuration={"fast"}
          unmountOnExit
          zIndex={10}
        >
          <StackH
            align={"center"}
            w={"full"}
            justify={"center"}
            p={3}
            pos={"absolute"}
            bottom={0}
            left={0}
            zIndex={2}
            pointerEvents={"none"}
          >
            <StackH
              align={"center"}
              gap={1}
              bg={GRID_BATCH_OPTIONS_CONTAINER_BG}
              backdropFilter={BACKDROP_BLUR_FILTER}
              p={1}
              border={"1px solid"}
              borderColor={"border.muted"}
              rounded={theme.radii.container}
              pointerEvents={"auto"}
            >
              <P mx={4}>
                <TNum>{`${selectedRows.length} ${t.selected.toLowerCase()}`}</TNum>
              </P>

              <Divider dir={"vertical"} h={"20px"} />

              <BatchOptions
                iconButton={false}
                size={"md"}
                selectedRows={selectedRows}
                clearSelectedRows={handleClearSelectedRows}
                batchOptions={batchOptions}
                allRowsSelected={allRowsSelected}
                handleSelectAllRows={handleSelectAllRows}
                pl={3}
                menuRootProps={{
                  positioning: {
                    placement: "top",
                    offset: {
                      mainAxis: 12,
                    },
                  },
                }}
              />
            </StackH>
          </StackH>
        </Presence>

        {/* Grid */}
        <StackV
          flex={1}
          // pt={`calc(${rSpacingMd} - 8px)`}
          pt={R_SPACING_MD}
          overflowY={"auto"}
        >
          <StackV
            className={"scrollY"}
            flex={1}
            px={R_SPACING_MD}
            //  pt={"8px"}
            pb={R_SPACING_MD}
          >
            <SimpleGrid
              templateColumns={`repeat(auto-fill, minmax(${minChildWidth}, 1fr))`}
              gap={GAP}
            >
              {rows?.map((row, index) => {
                const details = row?.columns?.map((col, rowIdx) => {
                  const label = headers?.[rowIdx].th;

                  switch (col.dataType) {
                    case "image":
                      return {
                        label,
                        render: (
                          <ImgViewer
                            id={`img-${rowIdx}-${row?.id}`}
                            src={imgUrl(col.value)}
                            w={"33%"}
                          >
                            <Img src={imgUrl(col.value)} w={"full"} fluid />
                          </ImgViewer>
                        ),
                      };

                    default:
                      return {
                        label,
                        render: col.td,
                      };
                  }
                });

                return (
                  <Fragment key={index}>
                    {props.gridItem({
                      row,
                      index,
                      details,
                    })}
                  </Fragment>
                );
              })}
            </SimpleGrid>
          </StackV>
        </StackV>

        {/* Footer */}
        {hasFooter && (
          <DataListFooter
            limit={limit}
            setLimit={setLimit}
            currentDataLength={rows?.length}
            totalData={totalData}
            page={page}
            setPage={setPage}
            totalPage={totalPage}
          />
        )}
      </StackV>
    </DataGridContext.Provider>
  );
};

// -----------------------------------------------------------------

export const DataGrid = {
  Root: DataGridRoot,
  Item: DataGridItem,
  DetailTrigger: DataGridDetailTrigger,
  RowOptions: DataGridRowOptions,
};
