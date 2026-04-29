import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Menu } from "@/components/ui/menu";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
import {
  FormattedTableRow,
  RowOptionsTableOptionGenerator,
} from "@/shared/constants/interfaces";
import { MenuRootProps } from "@chakra-ui/react";
import { EllipsisVerticalIcon } from "lucide-react";

// -----------------------------------------------------------------

export interface Props_RowOptions extends BtnProps {
  row: FormattedTableRow;
  rowOptions?: RowOptionsTableOptionGenerator<FormattedTableRow>[];
  tableContainerRef?: React.RefObject<HTMLDivElement | null>;
  menuRootProps?: Omit<MenuRootProps, "children">;
}

export const RowOptions = (props: Props_RowOptions) => {
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
          <AppIconLucide icon={EllipsisVerticalIcon} />
        </Btn>
      </Menu.Trigger>

      <Menu.Content minW={"140px"} mr={1} zIndex={10}>
        {rowOptions?.map((item, idx) => {
          // if (item === "divider") return <MenuSeparator key={idx} />;

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
                key={idx}
                w={"full"}
                id={`${row.id}-confirmation-${idx}`}
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
            return <CContainer key={idx}>{override}</CContainer>;
          }

          return (
            <Menu.Item
              key={idx}
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
      </Menu.Content>
    </Menu.Root>
  );
};
