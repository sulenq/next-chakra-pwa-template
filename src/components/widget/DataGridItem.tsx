"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { DataGridDetailDisclosureTrigger } from "@/components/widget/DataGridDetailDisclosure";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { RowOptions } from "@/components/widget/RowOptions";
import {
  Interface__DataProps,
  Interface__FormattedTableRow,
} from "@/constants/interfaces";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, HStack, StackProps } from "@chakra-ui/react";
import React from "react";

interface Props extends StackProps {
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
  row: Interface__FormattedTableRow;
  selectedRows: string[];
  toggleRowSelection: (row: Interface__FormattedTableRow) => void;
  routeTitle: string;
  details: any;
}

export const DataGridItem = (props: Props) => {
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
  const { themeConfig } = useThemeConfig();

  // States
  const isRowSelected = selectedRows.includes(row.id);
  const selectedColor = `${themeConfig.colorPalette}.focusRing`;

  return (
    <CContainer
      key={item.id}
      flex={1}
      border={"1px solid"}
      borderColor={isRowSelected ? selectedColor : "d1"}
      rounded={themeConfig.radii.component}
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
          top={2}
          right={2}
          zIndex={2}
        />
      </Box>

      {item.showImg && (
        <ImgViewer
          w={"full"}
          src={item.img}
          aspectRatio={1.1}
          fallbackSrc={item.imgFallbackSrc}
          opacity={dim || row.dim ? 0.4 : 1}
        >
          <Img
            src={item.img}
            aspectRatio={1.1}
            rounded={themeConfig.radii.component}
            fallbackSrc={item.imgFallbackSrc}
          />
        </ImgViewer>
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
            <P fontWeight={"semibold"} lineClamp={1}>
              {item.title}
            </P>
          ) : (
            item.title
          )}
        </HStack>

        {typeof item.description === "string" ? (
          <P color={"fg.subtle"} lineClamp={1}>
            {item.description}
          </P>
        ) : (
          item.description
        )}
      </CContainer>

      <HStack p={2}>
        <DataGridDetailDisclosureTrigger
          key={item.id}
          className="lg-clicky"
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
            rounded={`calc(${themeConfig.radii.component} - 2px)`}
          >
            Detail
          </Btn>
        </DataGridDetailDisclosureTrigger>

        <RowOptions
          row={row}
          rowOptions={dataProps.rowOptions}
          size={"sm"}
          variant={"outline"}
          rounded={`calc(${themeConfig.radii.component} - 2px)`}
          menuRootProps={{
            positioning: {
              offset: {
                mainAxis: 16, // px
              },
            },
          }}
        />
      </HStack>
    </CContainer>
  );
};
