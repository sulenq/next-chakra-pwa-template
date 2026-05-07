import { Btn, BtnProps } from "@/components/ui/btn";
import { Menu } from "@/components/ui/menu";
import { StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
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

  // Contexts
  // const { themeContext } = useThemeContext();

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
            // if (item === "divider") return <MenuSeparator key={index} />;
            // const isLastIndex = index === rowOptions.length - 1;

            const option = item(row);
            if (!option) return null;

            const {
              disabled = false,
              label = "",
              icon,
              onClick = () => {},
              confirmation,
              menuItemProps,
              override,
            } = option;

            if (confirmation) {
              return (
                <Confirmation.Trigger
                  key={index}
                  w={"full"}
                  id={`${row.id}-confirmation-${index}`}
                  title={confirmation.title}
                  description={confirmation.description}
                  confirmLabel={confirmation.confirmLabel}
                  onConfirm={confirmation.onConfirm}
                  confirmButtonProps={confirmation.confirmButtonProps}
                  loading={confirmation.loading}
                  disabled={disabled}
                >
                  <Menu.Item
                    value={label}
                    color={"fg.error"}
                    disabled={disabled}
                    {...menuItemProps}
                    justifyContent={"space-between"}
                  >
                    {label}
                    {icon && <AppIconLucide icon={icon} />}
                  </Menu.Item>
                </Confirmation.Trigger>
              );
            }
            if (override) {
              return <React.Fragment key={index}>{override}</React.Fragment>;
            }

            return (
              <Menu.Item
                key={index}
                disabled={disabled}
                value={label}
                onClick={() => {
                  if (!disabled) {
                    onClick();
                  }
                }}
                justifyContent={"space-between"}
                {...menuItemProps}
              >
                {label}
                {icon && <AppIconLucide icon={icon} />}
              </Menu.Item>
            );
          })}
        </StackV>
      </Menu.Content>
    </Menu.Root>
  );
};
