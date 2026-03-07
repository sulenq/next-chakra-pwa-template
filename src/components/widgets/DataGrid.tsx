"use client";

import { CContainer } from "@/components/ui/c-container";
import { Divider } from "@/components/ui/divider";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { BatchOptions } from "@/components/widgets/BatchOptions";
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
import { isEmptyArray } from "@/utils/array";
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
export const DataGrid = (props: DataGridProps) => {
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
