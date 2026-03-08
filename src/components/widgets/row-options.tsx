import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { AppIcon } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
import {
  FormattedTableRow,
  RowOptionsTableOptionGenerator,
} from "@/constants/interfaces";
import { MenuRootProps } from "@chakra-ui/react";
import { EllipsisVerticalIcon } from "lucide-react";

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
    <MenuRoot
      lazyMount
      positioning={{
        offset: {
          crossAxis: 4,
        },
      }}
      {...menuRootProps}
    >
      <MenuTrigger asChild aria-label="row-options">
        <Btn
          iconButton
          variant={"ghost"}
          size={"xs"}
          _open={{ bg: "d0" }}
          {...restProps}
        >
          <AppIcon icon={EllipsisVerticalIcon} />
        </Btn>
      </MenuTrigger>

      <MenuContent
        portalRef={tableContainerRef}
        zIndex={10}
        minW={"140px"}
        mr={1}
      >
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
                w="full"
                id={`${row.id}-confirmation-${idx}`}
                title={confirmation.title}
                description={confirmation.description}
                confirmLabel={confirmation.confirmLabel}
                onConfirm={confirmation.onConfirm}
                confirmButtonProps={confirmation.confirmButtonProps}
                loading={confirmation.loading}
                disabled={disabled}
              >
                <MenuItem
                  value={label}
                  color={"fg.error"}
                  disabled={disabled}
                  {...menuItemProps}
                  justifyContent="space-between"
                >
                  {label}
                  {icon && <AppIcon icon={icon} />}
                </MenuItem>
              </Confirmation.Trigger>
            );
          }

          if (override) {
            return <CContainer key={idx}>{override}</CContainer>;
          }

          return (
            <MenuItem
              key={idx}
              disabled={disabled}
              value={label}
              onClick={() => {
                if (!disabled) {
                  onClick();
                }
              }}
              justifyContent="space-between"
              {...menuItemProps}
            >
              {label}
              {icon && <AppIcon icon={icon} />}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
