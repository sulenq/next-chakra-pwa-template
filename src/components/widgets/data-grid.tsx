"use client";

import { Btn } from "@/components/ui/btn";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { StackV } from "@/components/ui/stack";
import { BackButton } from "@/components/widgets/back-button";
import { BatchOptions } from "@/components/widgets/batch-option";
import { ClampText } from "@/components/widgets/clamp-text";
import { DataFooter } from "@/components/widgets/data-footer";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { ImgViewer } from "@/components/widgets/img-viewer";
import { RowOptions } from "@/components/widgets/row-options";
import { DataProps, FormattedTableRow } from "@/constants/interfaces";
import {
  BACKDROP_BLUR_FILTER,
  GAP,
  GRID_BATCH_OPTIONS_CONTAINER_BG,
  R_SPACING_MD,
} from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { usePopDisclosure } from "@/hooks/usePopDisclosure";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import {
  Box,
  HStack,
  Presence,
  SimpleGrid,
  StackProps,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";

// -----------------------------------------------------------------

interface DataGridItemProps extends StackProps {
  item: {
    id: string;
    topElement?: React.ReactNode;
    imgSrc?: string;
    showImg?: boolean;
    imgFallback?: React.ReactNode;
    imgFallbackSrc?: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    deletedAt?: string | null;
  };
  dim?: boolean;
  dataProps: DataProps;
  row: FormattedTableRow;
  selectedRows: string[];
  toggleRowSelection: (row: FormattedTableRow) => void;
  routeTitle: string;
  details: any;
}

export const DataGridItem = (props: DataGridItemProps) => {
  // Props
  const {
    item,
    dim = false,
    dataProps,
    row,
    selectedRows,
    toggleRowSelection,
    routeTitle,
    details,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Constants
  const selectedColor = `${themeConfig.colorPalette}.solid`;

  // Derived Values
  const isRowSelected = selectedRows.includes(row.id);

  return (
    <StackV
      key={item.id}
      flex={1}
      bg={"bg.body"}
      border={"1px solid"}
      borderColor={isRowSelected ? selectedColor : "transparent"}
      rounded={themeConfig.radii.component}
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
          toggleRowSelection(row);
        }}
      >
        <Checkbox
          checked={isRowSelected}
          subtle
          borderColor={item.showImg ? "border.emphasized" : ""}
          zIndex={2}
        />
      </Box>

      {item.topElement}

      {item.showImg && (
        <StackV p={1}>
          <ImgViewer
            id={`img-${row?.idx}-${item?.id}`}
            w={"full"}
            h={"fit"}
            src={item.imgSrc}
            aspectRatio={1}
            fallback={item.imgFallback}
            fallbackSrc={item.imgFallbackSrc}
            opacity={dim || row.dim ? 0.4 : 1}
          >
            <Img
              key={item.imgSrc}
              src={item.imgSrc}
              aspectRatio={1}
              rounded={`calc(${themeConfig.radii.component} - 4px)`}
              fallback={item.imgFallback}
              fallbackSrc={item.imgFallbackSrc}
            />
          </ImgViewer>
        </StackV>
      )}

      <StackV flex={1} gap={1} px={3} opacity={dim || row.dim ? 0.4 : 1} my={3}>
        <HStack maxW={"calc(100% - 32px)"}>
          {typeof item.title === "string" ? (
            <ClampText fontWeight={"semibold"}>{item.title}</ClampText>
          ) : (
            item.title
          )}
        </HStack>

        {typeof item.description === "string" ? (
          <ClampText w={"full"} color={"fg.subtle"} lineClamp={1}>
            {item.description}
          </ClampText>
        ) : (
          item.description
        )}
      </StackV>

      <HStack p={2}>
        <DataGrid.DetailTrigger
          key={item.id}
          id={`${item.id}`}
          title={routeTitle}
          data={item}
          details={details}
          w={"full"}
          cursor={"pointer"}
        >
          <Btn
            variant={"outline"}
            size={"sm"}
            rounded={themeConfig.radii.component}
          >
            {t.view_more}
          </Btn>
        </DataGrid.DetailTrigger>

        {!isEmptyArray(dataProps.rowOptions) && (
          <RowOptions
            row={row}
            rowOptions={dataProps.rowOptions}
            size={"sm"}
            variant={"outline"}
            rounded={themeConfig.radii.component}
            menuRootProps={{
              positioning: {
                offset: {
                  mainAxis: 16, // px
                },
              },
            }}
          />
        )}
      </HStack>
    </StackV>
  );
};

// -----------------------------------------------------------------

interface DataGridDetailDisclosureProps extends StackProps {
  open: boolean;
  title: string;
  data: any;
  details: any;
}

const DataGridDetailContent = (props: DataGridDetailDisclosureProps) => {
  // Props
  const { open, title, data, details } = props;

  // States
  const [search, setSearch] = useState<string>("");
  const resolvedDetails = details.filter((detail: any) => {
    return detail?.label?.toLowerCase()?.includes(search?.toLowerCase());
  });

  return (
    <Disclosure.Root open={open} lazyLoad size={"xs"}>
      <Disclosure.Content>
        <Disclosure.Header>
          <Disclosure.HeaderContent title={`Detail ${title}`} />
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
            {data && (
              <>
                {isEmptyArray(resolvedDetails) && <FeedbackNotFound />}

                {resolvedDetails?.map((detail: any, idx: number) => {
                  const isLast = idx === resolvedDetails.length - 1;

                  return (
                    <StackV
                      key={idx}
                      gap={1}
                      px={1}
                      py={2}
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

interface DataGridDetailDisclosureTriggerProps extends StackProps {
  id: string;
  title: string;
  data: any;
  details: {
    label: string;
    render: any;
  }[];
}

const DataGridDetailTrigger = (props: DataGridDetailDisclosureTriggerProps) => {
  // Props
  const { children, id, title, data, details, ...restProps } = props;

  // Hooks
  const { open, onOpen } = usePopDisclosure(
    disclosureId(`data-grid-detail-${id}`),
  );

  return (
    <>
      <StackV w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </StackV>

      <DataGridDetailContent
        open={open}
        title={title}
        data={data}
        details={details}
      />
    </>
  );
};

// -----------------------------------------------------------------

interface GridItem {
  item: any;
  row: FormattedTableRow;
  idx: number;
  details: any;
  selectedRows: string[];
  toggleRowSelection: (row: FormattedTableRow) => void;
}

interface DataGridProps extends Omit<StackProps, "page"> {
  data?: any[];
  dataProps: DataProps;
  gridItem: (props: GridItem) => React.ReactNode;
  limit?: number;
  setLimit?: (limit: number) => void;
  page?: number;
  setPage?: (page: number) => void;
  totalPage?: number;
  totalData?: number;
  minChildWidth?: string;
}

const DataGridDisplay = (props: DataGridProps) => {
  // Props
  const {
    data,
    dataProps,
    limit,
    setLimit,
    page,
    setPage,
    totalPage,
    totalData,
    minChildWidth = "180px",
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // States
  const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  // Derived Values
  const hasFooter = limit && setLimit && page && setPage;
  const shouldShowBatch =
    dataProps?.batchOptions && !isEmptyArray(selectedRows);

  // Utils
  function handleSelectAllRows(isChecked: boolean) {
    setAllRowsSelected(!allRowsSelected);
    if (!isChecked) {
      const allIds = data?.map((row) => row.id);
      setSelectedRows(allIds || []);
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
        if (data?.length === selectedRows.length + 1) {
          setAllRowsSelected(true);
        }
        return [...ps, rowId];
      }
    });
  }

  return (
    <StackV flex={1} overflowY={"auto"} pos={"relative"} {...restProps}>
      {/* Batch Options */}
      <Presence
        present={shouldShowBatch}
        animationName={{ _open: "fade-in", _closed: "fade-out" }}
        animationDuration={"slow"}
        unmountOnExit
        zIndex={10}
      >
        <HStack
          w={"full"}
          justify={"center"}
          p={3}
          pos={"absolute"}
          bottom={0}
          left={0}
          zIndex={2}
          pointerEvents={"none"}
        >
          <HStack
            gap={1}
            bg={GRID_BATCH_OPTIONS_CONTAINER_BG}
            backdropFilter={BACKDROP_BLUR_FILTER}
            p={1}
            border={"1px solid"}
            borderColor={"border.muted"}
            rounded={themeConfig.radii.container}
            pointerEvents={"auto"}
          >
            <P mx={4}>{`${selectedRows.length} ${t.selected.toLowerCase()}`}</P>

            <Divider dir={"vertical"} h={"20px"} />

            <BatchOptions
              iconButton={false}
              size={"md"}
              selectedRows={selectedRows}
              clearSelectedRows={handleClearSelectedRows}
              batchOptions={dataProps?.batchOptions}
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
          </HStack>
        </HStack>
      </Presence>

      {/* Grid */}
      <StackV
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
            {data?.map((item, idx) => {
              const row = dataProps.rows?.[idx] as FormattedTableRow;
              const details = row.columns.map((col, rowIdx) => {
                const label = dataProps.headers?.[rowIdx].th;

                switch (col.dataType) {
                  case "image":
                    return {
                      label,
                      render: (
                        <ImgViewer
                          id={`img-${rowIdx}-${item?.id}`}
                          src={col.value}
                          w={"full"}
                        >
                          <Img src={col.value} w={"full"} fluid />
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
                <Fragment key={idx}>
                  {props.gridItem({
                    item,
                    row,
                    idx,
                    details,
                    selectedRows,
                    toggleRowSelection,
                  })}
                </Fragment>
              );
            })}
          </SimpleGrid>
        </StackV>
      </StackV>

      {/* Footer */}
      {hasFooter && (
        <DataFooter
          limit={limit}
          setLimit={setLimit}
          dataLength={data?.length}
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

export const DataGrid = {
  Display: DataGridDisplay,
  Item: DataGridItem,
  DetailTrigger: DataGridDetailTrigger,
};
