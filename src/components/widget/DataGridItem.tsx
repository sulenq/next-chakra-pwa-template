"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { Img } from "@/components/ui/img";
import { ClampText } from "@/components/widget/ClampText";
import { DataGridDetailDisclosureTrigger } from "@/components/widget/DataGridDetailDisclosure";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { RowOptions } from "@/components/widget/RowOptions";
import {
  Interface__DataProps,
  Interface__FormattedTableRow,
} from "@/constants/interfaces";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { isEmptyArray } from "@/utils/array";
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
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const isRowSelected = selectedRows.includes(row.id);
  const selectedColor = `${themeConfig.colorPalette}.focusRing`;

  return (
    <CContainer
      key={item.id}
      flex={1}
      border={"1px solid"}
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
          top={2}
          right={2}
          borderColor={item.showImg ? "border.emphasized" : ""}
          zIndex={2}
        />
      </Box>

      {item.showImg && (
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
        <DataGridDetailDisclosureTrigger
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
            {l.view_more}
          </Btn>
        </DataGridDetailDisclosureTrigger>

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
