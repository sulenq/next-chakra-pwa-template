import { Btn, BtnProps } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Menu } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
import { DotIndicator } from "@/components/widgets/indicator";
import { BatchOptionsTableOptionGenerator } from "@/shared/constants/interfaces";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { MenuRootProps } from "@chakra-ui/react";
import { EllipsisIcon } from "lucide-react";
import { Fragment } from "react";

// -----------------------------------------------------------------

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
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  return (
    <Menu.Root
      lazyMount
      positioning={{
        offset: {
          mainAxis: 6,
        },
      }}
      {...menuRootProps}
    >
      <Menu.Trigger asChild aria-label={"batch options"}>
        <Btn
          iconButton={iconButton}
          clicky={false}
          variant={"ghost"}
          size={"xs"}
          _open={{
            bg: "d0",
          }}
          {...restProps}
        >
          {children ? children : <AppIconLucide icon={EllipsisIcon} />}

          {!iconButton && "Batch Options"}
        </Btn>
      </Menu.Trigger>

      <Menu.Content minW={"140px"} zIndex={10}>
        <CContainer px={3} py={1}>
          <P fontSize={"sm"} opacity={0.5} fontWeight={500}>
            {`${selectedRows.length} ${t.selected.toLowerCase()}`}
          </P>
        </CContainer>

        <Menu.Item
          value={"select all"}
          justifyContent={"space-between"}
          onClick={() => {
            handleSelectAllRows(allRowsSelected);
          }}
          closeOnSelect={false}
        >
          <P>{t.select_all}</P>

          <DotIndicator
            bg={allRowsSelected ? themeConfig.primaryColor : "gray.muted"}
            mr={1}
          />
        </Menu.Item>

        <Menu.Separator />

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
              <Confirmation.Trigger
                key={idx}
                w={"full"}
                id={`confirmation-batch-${idx}`}
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
            return <Fragment key={idx}>{override}</Fragment>;
          }

          return (
            <Menu.Item
              key={idx}
              value={label}
              onClick={() => {
                if (!resolvedDisabled) onClick();
              }}
              disabled={resolvedDisabled}
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
