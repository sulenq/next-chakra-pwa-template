import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DotIndicator } from "@/components/widget/Indicator";
import { Props__BatchOptions } from "@/constants/props";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Icon } from "@chakra-ui/react";
import { IconMenu } from "@tabler/icons-react";

import { Fragment } from "react";
const ICON_BOX_SIZE = "18px";

export const BatchOptions = (props: Props__BatchOptions) => {
  // Props
  const {
    children,
    selectedRows,
    clearSelectedRows,
    batchOptions,
    allRowsSelected,
    handleSelectAllRows,
    tableContainerRef,
    menuRootProps,
    ...restProps
  } = props;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <MenuRoot lazyMount {...menuRootProps}>
      <MenuTrigger asChild aria-label="batch options">
        <Btn
          iconButton
          variant={"ghost"}
          size={"xs"}
          _open={{
            bg: "d0",
          }}
          {...restProps}
        >
          {children ? (
            children
          ) : (
            <Icon boxSize={5}>
              <IconMenu stroke={1.5} />
            </Icon>
          )}
        </Btn>
      </MenuTrigger>

      <MenuContent portalRef={tableContainerRef} zIndex={10} minW={"140px"}>
        <CContainer px={3} py={1}>
          <P fontSize={"sm"} opacity={0.5} fontWeight={500}>
            {`${selectedRows.length} ${l.selected.toLowerCase()}`}
          </P>
        </CContainer>

        <MenuItem
          value={"select all"}
          justifyContent={"space-between"}
          onClick={() => {
            handleSelectAllRows(allRowsSelected);
          }}
          closeOnSelect={false}
        >
          <P>{l.select_all}</P>

          <DotIndicator
            color={allRowsSelected ? themeConfig.primaryColor : "d2"}
            mr={1}
          />
        </MenuItem>

        <MenuSeparator />

        {batchOptions?.map((item, idx) => {
          const noSelection = selectedRows.length === 0;

          // if (item === "divider") return <MenuSeparator key={idx} />;

          const option = item(selectedRows, {
            clearSelectedRows: clearSelectedRows,
          });
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

          const resolvedDisabled = noSelection || disabled;

          if (confirmation) {
            return (
              <ConfirmationDisclosureTrigger
                key={idx}
                w="full"
                id={`confirmation-batch-${idx}`}
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
              value={label}
              onClick={() => {
                if (!resolvedDisabled) onClick();
              }}
              disabled={resolvedDisabled}
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
