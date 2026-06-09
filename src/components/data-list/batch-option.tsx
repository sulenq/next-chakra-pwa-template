import { Btn, BtnProps } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { Menu } from "@/components/ui/menu";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { AppIconLucide } from "@/components/branding/app-icon";
import { DotIndicator } from "@/components/ui/indicator";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { BatchOptionsTableOptionGenerator } from "@/types/global.types";
import { Box, MenuRootProps } from "@chakra-ui/react";
import { ListChecks } from "lucide-react";
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

  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

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
          variant={"ghost"}
          size={"xs"}
          _open={{
            bg: "d0",
          }}
          {...restProps}
        >
          {children ? children : <AppIconLucide icon={ListChecks} />}

          {!iconButton && "Batch Options"}
        </Btn>
      </Menu.Trigger>

      <Menu.Content minW={"140px"} zIndex={10}>
        <StackV px={3} py={1}>
          <P fontSize={"sm"} opacity={0.5} fontWeight={500}>
            {`${selectedRows.length} ${t.selected.toLowerCase()}`}
          </P>
        </StackV>

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
            bg={allRowsSelected ? theme.primaryColor : "gray.muted"}
            mr={1}
          />
        </Menu.Item>

        <Box px={`calc(${theme.radii.component}/4)`} my={1}>
          <Divider />
        </Box>

        {batchOptions?.map((item, index) => {
          const node = item(selectedRows, {
            clearSelectedRows: clearSelectedRows,
          });
          if (!node) return null;
          return <Fragment key={index}>{node}</Fragment>;
        })}
      </Menu.Content>
    </Menu.Root>
  );
};
