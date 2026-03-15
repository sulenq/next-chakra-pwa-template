"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { SearchInput } from "@/components/ui/search-input";
import { BackButton } from "@/components/widgets/back-button";
import { BatchOptions } from "@/components/widgets/batch-option";
import { ClampText } from "@/components/widgets/clamp-text";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import { ImgViewer } from "@/components/widgets/img-viewer";
import { Limitation } from "@/components/widgets/limitation";
import { Pagination } from "@/components/widgets/pagination";
import { RowOptions } from "@/components/widgets/row-options";
import {
  FormattedTableRow,
  Interface__DataProps,
} from "@/constants/interfaces";
import {
  GAP,
  GRID_ITEM_CONTAINER_BG,
  GRID_BATCH_OPTIONS_CONTAINER_BG,
  R_SPACING_MD,
  GRID_FOOTER_BORDER_COLOR,
} from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
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
import { Fragment, useState } from "react";

export interface GridItemProps {
  item: any;
  row: FormattedTableRow;
  idx: number;
  details: any;
  selectedRows: string[];
  toggleRowSelection: (row: FormattedTableRow) => void;
}

interface DataGridItemProps extends StackProps {
  item: {
    id: string;
    img?: string;
    showImg?: boolean;
    imgFallbackSrc?: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
    deletedAt?: string | null;
  };
  dim?: boolean;
  dataProps: Interface__DataProps;
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
  const selectedColor = `${themeConfig.colorPalette}.focusRing`;

  // Derived Values
  const isRowSelected = selectedRows.includes(row.id);

  return (
    <CContainer
      key={item.id}
      flex={1}
      bg={GRID_ITEM_CONTAINER_BG}
      // border={"1px solid"}
      borderColor={isRowSelected ? selectedColor : "border.subtle"}
      rounded={themeConfig.radii.container}
      overflow={"clip"}
      pos={"relative"}
      {...restProps}
    >
      <Box
        onClick={(e) => {
          e.stopPropagation();
          toggleRowSelection(row);
        }}
      >
        <Checkbox
          checked={isRowSelected}
          subtle
          pos={"absolute"}
          top={3}
          right={3}
          borderColor={item.showImg ? "border.emphasized" : ""}
          zIndex={2}
        />
      </Box>

      {item.showImg && (
        <CContainer p={1}>
          <ImgViewer
            id={`img-${row?.idx}-${item?.id}`}
            w={"full"}
            src={item.img}
            aspectRatio={1.1}
            fallbackSrc={item.imgFallbackSrc}
            opacity={dim || row.dim ? 0.4 : 1}
          >
            <Img
              key={item.img}
              src={item.img}
              aspectRatio={1.1}
              rounded={themeConfig.radii.component}
              fallbackSrc={item.imgFallbackSrc}
            />
          </ImgViewer>
        </CContainer>
      )}

      <CContainer
        flex={1}
        gap={1}
        px={3}
        opacity={dim || row.dim ? 0.4 : 1}
        my={3}
      >
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
      </CContainer>

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
    </CContainer>
  );
};

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
          <CContainer mb={2}>
            <SearchInput
              queryKey={"q-data-grid-detail"}
              inputValue={search}
              onChange={(inputValue) => {
                setSearch(inputValue);
              }}
            />
          </CContainer>

          <CContainer>
            {data && (
              <>
                {isEmptyArray(resolvedDetails) && <FeedbackNotFound />}

                {resolvedDetails?.map((detail: any, idx: number) => {
                  const isLast = idx === resolvedDetails.length - 1;

                  return (
                    <CContainer
                      key={idx}
                      gap={2}
                      px={1}
                      py={3}
                      borderBottom={!isLast ? "1px solid" : ""}
                      borderColor={"border.subtle"}
                      align={"start"}
                    >
                      <P fontWeight={"medium"} color={"fg.subtle"}>
                        {detail.label}
                      </P>

                      {detail.render}
                    </CContainer>
                  );
                })}
              </>
            )}
          </CContainer>
        </Disclosure.Body>

        <Disclosure.Footer>
          <BackButton />
        </Disclosure.Footer>
      </Disclosure.Content>
    </Disclosure.Root>
  );
};

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
      <CContainer w={"fit"} onClick={onOpen} {...restProps}>
        {children}
      </CContainer>

      <DataGridDetailContent
        open={open}
        title={title}
        data={data}
        details={details}
      />
    </>
  );
};

interface DataGridProps extends Omit<StackProps, "page"> {
  data?: any[];
  dataProps: Interface__DataProps;
  gridItem: (props: GridItemProps) => React.ReactNode;
  limit?: number;
  setLimit?: (limit: number) => void;
  page?: number;
  setPage?: (page: number) => void;
  totalPage?: number;
  footer?: React.ReactNode;
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
    footer,
    minChildWidth = "180px",
    p = R_SPACING_MD,
    px,
    py,
    pl,
    pr,
    pt,
    pb,
    ...restProps
  } = props;

  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

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
    <CContainer flex={1} overflowY={"auto"} pos={"relative"} {...restProps}>
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

      <CContainer
        // borderTop={"1px solid"}
        borderColor={"border.muted"}
        overflowY={"auto"}
      >
        <CContainer
          className={"scrollY"}
          flex={1}
          p={p}
          px={px}
          py={py}
          pl={pl}
          pr={pr}
          pt={pt}
          pb={pb}
          rounded={themeConfig.radii.container}
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
        </CContainer>
      </CContainer>

      {hasFooter && (
        <>
          <HStack
            w={"full"}
            p={3}
            borderTop={"1px solid"}
            borderColor={GRID_FOOTER_BORDER_COLOR}
            justify={"space-between"}
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

export const DataGrid = {
  Display: DataGridDisplay,
  Item: DataGridItem,
  DetailTrigger: DataGridDetailTrigger,
};
