import { Btn } from "@/components/ui/btn";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from "@/components/ui/menu";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { Props_RowOptions } from "@/constants/props";
import { Icon } from "@chakra-ui/react";
import { IconDots } from "@tabler/icons-react";
import { Fragment } from "react";

const ICON_BOX_SIZE = "18px";

export const RowOptions = (props: Props_RowOptions) => {
  // Props
  const { row, rowOptions, tableContainerRef, menuRootProps, ...restProps } =
    props;

  return (
    <MenuRoot lazyMount {...menuRootProps}>
      <MenuTrigger asChild aria-label="row options">
        <Btn
          iconButton
          clicky={false}
          variant={"ghost"}
          size={"xs"}
          {...restProps}
        >
          <Icon boxSize={5}>
            <IconDots stroke={1.5} />
          </Icon>
        </Btn>
      </MenuTrigger>

      <MenuContent portalRef={tableContainerRef} zIndex={10} minW={"140px"}>
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
              <ConfirmationDisclosureTrigger
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
                  {icon && <Icon boxSize={ICON_BOX_SIZE}>{icon}</Icon>}
                </MenuItem>
              </ConfirmationDisclosureTrigger>
            );
          }

          if (override) {
            return <Fragment key={idx}>{override}</Fragment>;
          }

          return (
            <MenuItem
              key={idx}
              disabled={disabled}
              value={label}
              onClick={() => {
                if (!disabled) onClick();
              }}
              justifyContent="space-between"
              {...menuItemProps}
            >
              {label}
              {icon && <Icon boxSize={ICON_BOX_SIZE}>{icon}</Icon>}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
