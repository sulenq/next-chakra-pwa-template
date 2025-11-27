"use client";

import SearchInput from "@/components/ui/search-input";
import { DataTable } from "@/components/widget/DataTable";
import HScroll from "@/components/widget/HScroll";
import { PageContainer, PageContent } from "@/components/widget/Page";
import { HStack } from "@chakra-ui/react";
import { IconPencil, IconRestore, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

const DemoDataTable = () => {
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
  return (
    <PageContainer>
      <PageContent>
        <HScroll
          p={3}
          // borderBottom={"1px solid"}
          borderColor={"border.muted"}
        >
          <HStack minW={"full"} w={"max"}>
            <SearchInput />
          </HStack>
        </HScroll>

        <DemoDataTable />
      </PageContent>
    </PageContainer>
  );
}
