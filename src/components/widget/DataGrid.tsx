"use client";

import { CContainer } from "@/components/ui/c-container";
import { BatchOptions } from "@/components/widget/BatchOptions";
import { DataGridItem } from "@/components/widget/DataGridItem";
import { Limitation } from "@/components/widget/Limitation";
import { Pagination } from "@/components/widget/Pagination";
import {
  Interface__DataProps,
  Interface__FormattedTableRow,
} from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { isEmptyArray } from "@/utils/array";
import { imgUrl } from "@/utils/url";
import { HStack, Icon, SimpleGrid, StackProps } from "@chakra-ui/react";
import { IconMenu } from "@tabler/icons-react";
import { useRef, useState } from "react";

interface Props extends Omit<StackProps, "page"> {
  data?: any[];
  dataProps: Interface__DataProps;
  limit?: number;
  setLimit?: (limit: number) => void;
  page?: number;
  setPage?: (page: number) => void;
  totalPage?: number;
  footer?: React.ReactNode;
  routeTitle: string;
}

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
    routeTitle,
    ...restProps
  } = props;

  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();
  const containerRef = useRef<HTMLDivElement>(null);
  const { width: containerWidth } = useContainerDimension(containerRef);

  // States
  const gridCols = Math.max(1, Math.floor(containerWidth / 195));
  const hasFooter = limit && setLimit && page && setPage;
  const [allRowsSelected, setAllRowsSelected] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

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
    <>
      <CContainer
        ref={containerRef}
        flex={1}
        px={3}
        pos={"relative"}
        {...restProps}
      >
        {dataProps?.batchOptions && !isEmptyArray(selectedRows) && (
          <HStack
            w={"full"}
            justify={"center"}
            p={3}
            pos={"absolute"}
            bottom={0}
            left={0}
            zIndex={2}
          >
            <HStack
              bg={"body"}
              border={"1px solid"}
              borderColor={"border.muted"}
              rounded={themeConfig.radii.component}
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
                Batch Options
              </BatchOptions>
            </HStack>
          </HStack>
        )}

        <CContainer className="scrollY" flex={1}>
          <SimpleGrid columns={gridCols} gap={4} mt={4}>
            {data?.map((item, idx) => {
              const row = dataProps.rows?.[idx] as Interface__FormattedTableRow;
              const details = row.columns.map((col, rowIdx) => ({
                label: dataProps.headers?.[rowIdx].th,
                render: col.td,
              }));

              return (
                <DataGridItem
                  key={item.id}
                  item={{
                    id: item.id,
                    showImg: true,
                    img: imgUrl(item.user.photoProfile?.[0]?.filePath),
                    imgFallbackSrc: `${SVGS_PATH}/no-avatar.svg`,
                    title: item.user.name,
                    description: item.user.email,
                    deletedAt: item.user.deactiveAt,
                  }}
                  dataProps={dataProps}
                  row={row}
                  selectedRows={selectedRows}
                  toggleRowSelection={toggleRowSelection}
                  routeTitle={routeTitle}
                  details={details}
                />
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
            borderColor={"border.muted"}
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
    </>
  );
};
