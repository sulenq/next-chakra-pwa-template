"use client";

import { Btn } from "@/components/ui/btn";
import SearchInput from "@/components/ui/search-input";
import { DataDisplayToggle } from "@/components/widget/DataDisplayToggle";
import { DataTable } from "@/components/widget/DataTable";
import HScroll from "@/components/widget/HScroll";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { PageTitle } from "@/components/widget/Page";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { HStack, Icon } from "@chakra-ui/react";
import {
  IconFilter2,
  IconPencil,
  IconPlus,
  IconRestore,
  IconSortDescending,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";

// const BASE_ENDPOINT = "/api/kmis/material";
const PREFIX_ID = "kmis_material";
// type Interface__Data = Interface__KMISMaterial;

const Create = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <>
      <Btn size={"sm"} pl={3} colorPalette={themeConfig.colorPalette}>
        <Icon>
          <IconPlus stroke={1.5} />
        </Icon>
        Add
      </Btn>
    </>
  );
};
const DataUtils = () => {
  return (
    <HStack>
      <SearchInput
        inputProps={{
          size: "sm",
        }}
      />

      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={5}>
          <IconFilter2 stroke={1.5} />
        </Icon>
      </Btn>
      <Btn iconButton variant={"outline"} size={"sm"}>
        <Icon boxSize={5}>
          <IconSortDescending stroke={1.5} />
        </Icon>
      </Btn>
      <DataDisplayToggle iconButton navKey={PREFIX_ID} size={"sm"} />
    </HStack>
  );
};
const Data = () => {
  // States
  const tableProps = {
    headers: [
      {
        th: "Name",
        sortable: true,
      },
      {
        th: "Age",
        sortable: true,
      },
      {
        th: "Join Date",
        sortable: true,
      },
    ],
    rows: [
      {
        id: "1",
        idx: 1,
        data: { name: "Alice Johnson", age: 28, joinDate: "2023-01-12" },
        columns: [
          {
            td: "Alice Johnson",
            value: "Alice Johnson",
            dataType: "string",
          },
          { td: "28", value: 28, dataType: "number" },
          {
            td: "2023-01-12",
            value: "2023-01-12",
            dataType: "date",
          },
        ],
      },
      {
        id: "3",
        idx: 2,
        data: { name: "Charlie Davis", age: 41, joinDate: "2021-05-17" },
        columns: [
          {
            td: "Charlie Davis",
            value: "Charlie Davis",
            dataType: "string",
          },
          { td: "41", value: 41, dataType: "number" },
          {
            td: "2021-05-17",
            value: "2021-05-17",
            dataType: "date",
          },
        ],
      },
      {
        id: "2",
        idx: 3,
        data: { name: "Bob Smith", age: 34, joinDate: "2022-09-30" },
        columns: [
          {
            td: "Bob Smith",
            value: "Bob Smith",
            dataType: "string",
          },
          { td: "34", value: 34, dataType: "number" },
          {
            td: "2022-09-30",
            value: "2022-09-30",
            dataType: "date",
          },
        ],
      },
    ],
    rowOptions: [
      () => ({
        label: "Edit",
        icon: <IconPencil stroke={1.5} />,
        onClick: () => console.log("Edit"),
      }),
      () => ({
        label: "Restore",
        icon: <IconRestore stroke={1.5} />,
        onClick: () => console.log("Restore"),
      }),
      () => ({
        label: "Delete",
        icon: <IconTrash stroke={1.5} />,
        menuItemProps: { color: "fg.error" },
        onClick: () => console.log("Delete"),
        confirmation: {
          id: "deleteUsr",
          title: "Delete User",
          description: `Are you sure you want to delete?`,
          confirmLabel: "Delete",
          onConfrim: () => console.log("Confirmed delete"),
          confirmButtonProps: {
            colorPalette: "",
            variant: "outline",
            color: "fg.error",
          },
        },
      }),
    ],
    batchOptions: [
      (ids: string[]) => ({
        label: "Restore",
        icon: <IconRestore stroke={1.5} />,
        onClick: () => console.log("Restore", ids),
      }),
      (ids: string[]) => ({
        label: "Delete",
        icon: <IconTrash stroke={1.5} />,
        menuItemProps: { color: "fg.error" },
        onClick: () => console.log("Delete", ids),
      }),
    ],
  };
  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  return (
    <DataTable
      headers={tableProps.headers}
      rows={tableProps.rows}
      rowOptions={tableProps.rowOptions}
      batchOptions={tableProps.batchOptions}
      limit={limit}
      setLimit={setLimit}
      page={page}
      setPage={setPage}
    />
  );
};

export default function Page() {
  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <PageContainer>
      <PageTitle justify={"space-between"} pr={3}>
        <HStack>
          {!iss && <DataUtils />}

          <Create />
        </HStack>
      </PageTitle>

      <PageContent gap={1}>
        <HScroll px={3} flexShrink={0}>
          <HStack minW={"full"} w={"max"} justify={"space-between"}>
            {iss && <DataUtils />}
          </HStack>
        </HScroll>

        <Data />
      </PageContent>
    </PageContainer>
  );
}
