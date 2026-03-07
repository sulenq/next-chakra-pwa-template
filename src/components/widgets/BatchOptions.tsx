import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { AppIcon } from "@/components/widgets/AppIcon";
import { ConfirmationDisclosureTrigger } from "@/components/widgets/ConfirmationDisclosure";
import { DotIndicator } from "@/components/widgets/Indicator";
import { BatchOptionsTableOptionGenerator } from "@/constants/interfaces";
import useLang from "@/contexts/useLang";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { MenuRootProps } from "@chakra-ui/react";
import { EllipsisIcon } from "lucide-react";
import { Fragment } from "react";

export interface BatchOptionsProps extends BtnProps {
  selectedRows: any[];
  clearSelectedRows: () => void;
  batchOptions?: BatchOptionsTableOptionGenerator[];
  allRowsSelected: boolean;
  handleSelectAllRows: (isChecked: boolean) => void;
  tableContainerRef?: React.RefObject<HTMLDivElement | null>;
  menuRootProps?: Omit<MenuRootProps, "children">;
}
export const BatchOptions = (props: BatchOptionsProps) => {
  // Props
  const {
    children,
    iconButton = true,
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
  const { t } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <MenuRoot
      lazyMount
      positioning={{
        offset: {
          mainAxis: 6,
        },
      }}
      {...menuRootProps}
    >
      <MenuTrigger asChild aria-label="batch options">
        <Btn
          iconButton={iconButton}
          variant={"ghost"}
          size={"xs"}
          _open={{
            bg: "d0",
          }}
          {...restProps}
        >
          {children ? children : <AppIcon icon={EllipsisIcon} />}

          {!iconButton && "Batch Options"}
        </Btn>
      </MenuTrigger>

      <MenuContent portalRef={tableContainerRef} zIndex={10} minW={"140px"}>
        <CContainer px={3} py={1}>
          <P fontSize={"sm"} opacity={0.5} fontWeight={500}>
            {`${selectedRows.length} ${t.selected.toLowerCase()}`}
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
          <P>{t.select_all}</P>

          <DotIndicator
            color={allRowsSelected ? themeConfig.primaryColor : "gray.muted"}
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
                  {icon && <AppIcon icon={icon} />}
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
              {icon && <AppIcon icon={icon} />}
            </MenuItem>
          );
        })}
      </MenuContent>
    </MenuRoot>
  );
};
