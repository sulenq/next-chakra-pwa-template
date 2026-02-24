"use client";

import { CContainer } from "@/components/ui/c-container";
import { Img } from "@/components/ui/img";
import { BatchOptions } from "@/components/widget/BatchOptions";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { Limitation } from "@/components/widget/Limitation";
import { Pagination } from "@/components/widget/Pagination";
import {
  Interface__DataProps,
  Interface__FormattedTableRow,
} from "@/constants/interfaces";
import { FIREFOX_SCROLL_Y_CLASS_PR_PREFIX } from "@/constants/styles";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { isEmptyArray } from "@/utils/array";
import {
  HStack,
  Icon,
  Presence,
  SimpleGrid,
  StackProps,
} from "@chakra-ui/react";
import { IconMenu } from "@tabler/icons-react";
import { Fragment, useRef, useState } from "react";

interface RenderItemProps {
  item: any;
  row: Interface__FormattedTableRow;
  idx: number;
  details: any;
  selectedRows: string[];
  toggleRowSelection: (row: Interface__FormattedTableRow) => void;
}
interface Props extends Omit<StackProps, "page"> {
  data?: any[];
  dataProps: Interface__DataProps;
  gridItem: (props: RenderItemProps) => React.ReactNode;
  limit?: number;
  setLimit?: (limit: number) => void;
  page?: number;
  setPage?: (page: number) => void;
  totalPage?: number;
  footer?: React.ReactNode;
}

const ITEM_MAX_W_NUMBER = 175;

export const DataGrid = (props: Props) => {
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
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useContainerDimension(containerRef);

  // States
  const gridCols = Math.max(1, Math.floor(containerWidth / ITEM_MAX_W_NUMBER));
  const hasFooter = limit && setLimit && page && setPage;
  const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
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
  function toggleRowSelection(row: Interface__FormattedTableRow) {
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
    <CContainer ref={containerRef} flex={1} overflowY={"auto"} {...restProps}>
      <CContainer flex={1} overflowY={"auto"} pos={"relative"}>
        <Presence
          present={shouldShowBatch}
          animationName={{ _open: "fade-in", _closed: "fade-out" }}
          animationDuration="fast"
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
              bg={"body"}
              border={"1px solid"}
              borderColor={"border.muted"}
              rounded={themeConfig.radii.component}
              pointerEvents={"auto"}
            >
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
                  },
                }}
              >
                <Icon>
                  <IconMenu stroke={1.5} />
                </Icon>
                Batch options
              </BatchOptions>
            </HStack>
          </HStack>
        </Presence>

        <CContainer
          className="scrollY"
          flex={1}
          pb={3}
          px={3}
          pr={`calc(12px - ${FIREFOX_SCROLL_Y_CLASS_PR_PREFIX})`}
        >
          {containerWidth > 0 && (
            <SimpleGrid columns={gridCols} gap={4}>
              {data?.map((item, idx) => {
                const row = dataProps.rows?.[
                  idx
                ] as Interface__FormattedTableRow;
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
          )}
        </CContainer>
      </CContainer>

      {hasFooter && (
        <>
          <HStack
            p={2}
            borderTop={"1px solid"}
            borderColor={"border.subtle"}
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
