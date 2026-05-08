import { Btn, BtnProps } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import {
  FormattedTableRow,
  RowOptionsTableOptionGenerator,
} from "@/types/global.types";
import { MenuRootProps } from "@chakra-ui/react";
import { EllipsisIcon } from "lucide-react";
import React from "react";

// -----------------------------------------------------------------

export interface RowOptionsProps extends BtnProps {
  row: FormattedTableRow;
  rowOptions?: RowOptionsTableOptionGenerator<FormattedTableRow>[];
  tableContainerRef?: React.RefObject<HTMLDivElement | null>;
  menuRootProps?: Omit<MenuRootProps, "children">;
}

export const RowOptions = (props: RowOptionsProps) => {
  // Props
  const { row, rowOptions, tableContainerRef, menuRootProps, ...restProps } =
    props;

  return (
    <Menu.Root
      lazyMount
      positioning={{
        offset: {
          crossAxis: 4,
        },
        hideWhenDetached: true,
      }}
      {...menuRootProps}
    >
      <Menu.Trigger asChild aria-label={"row-options"}>
        <Btn
          iconButton
          clicky={false}
          variant={"ghost"}
          size={"xs"}
          _open={{ bg: "d0" }}
          {...restProps}
        >
          <AppIconLucide icon={EllipsisIcon} />
        </Btn>
      </Menu.Trigger>

      <Menu.Content minW={"140px"} mr={1} zIndex={10}>
        <StackV gap={1}>
          {rowOptions?.map((item, index) => {
            const node = item(row);
            if (!node) return null;
            return <React.Fragment key={index}>{node}</React.Fragment>;
          })}
        </StackV>
      </Menu.Content>
    </Menu.Root>
  );
};
