"use client";

import { CContainer } from "@/components/ui/c-container";
import { Disclosure } from "@/components/ui/disclosure";
import { Divider } from "@/components/ui/divider";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import SearchInput from "@/components/ui/search-input";
import { BackButton } from "@/components/widgets/BackButton";
import { BatchOptions } from "@/components/widgets/BatchOptions";
import FeedbackNotFound from "@/components/widgets/FeedbackNotFound";
import { ImgViewer } from "@/components/widgets/ImgViewer";
import { Limitation } from "@/components/widgets/Limitation";
import { Pagination } from "@/components/widgets/Pagination";
import {
  FormattedTableRow,
  Interface__DataProps,
} from "@/constants/interfaces";
import useLang from "@/contexts/useLang";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import usePopDisclosure from "@/hooks/usePopDisclosure";
import { isEmptyArray } from "@/utils/array";
import { disclosureId } from "@/utils/disclosure";
import { HStack, Presence, SimpleGrid, StackProps } from "@chakra-ui/react";
import { Fragment, useState } from "react";

export interface GridItemProps {
  item: any;
  row: FormattedTableRow;
  idx: number;
  details: any;
  selectedRows: string[];
  toggleRowSelection: (row: FormattedTableRow) => void;
}

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
    ...restProps
  } = props;

  // Contexts
  const { t } = useLang();
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

  // SX
  const footerBorderColor = "border.subtle";

  return (
    <CContainer flex={1} overflowY={"auto"} {...restProps}>
      <CContainer flex={1} overflowY={"auto"} pos={"relative"}>
        <Presence
          present={shouldShowBatch}
          animationName={{ _open: "fade-in", _closed: "fade-out" }}
          animationDuration="slow"
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
              bg={"body"}
              p={1}
              border={"1px solid"}
              borderColor={"border.muted"}
              rounded={themeConfig.radii.container}
              pointerEvents={"auto"}
            >
              <P
                mx={4}
              >{`${selectedRows.length} ${t.selected.toLowerCase()}`}</P>

              <Divider dir={"vertical"} h={"30px"} />

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
          className="scrollY"
          flex={1}
          pb={3}
          px={3}
          // pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
        >
          <SimpleGrid
            templateColumns={`repeat(auto-fill, minmax(${minChildWidth}, 1fr))`}
            gap={4}
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
            p={3}
            borderTop={"1px solid"}
            borderColor={footerBorderColor}
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
  DetailTrigger: DataGridDetailTrigger,
};
