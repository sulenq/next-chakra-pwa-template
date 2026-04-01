"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { DateTimePickerInput } from "@/components/ui/date-time-picker-input";
import { Field } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { LangMenu } from "@/components/ui/lang-menu";
import { NavLink } from "@/components/ui/nav-link";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import { TinyMceRichEditor } from "@/components/ui/tiny-mce-rich-editor";
import { SearchInput } from "@/components/ui/search-input";
import { SelectInput } from "@/components/ui/select-input";
import { StringInput } from "@/components/ui/string-input";
import { TextareaInput } from "@/components/ui/textarea-input";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { Calendar } from "@/components/widgets/calendar";
import { Clock } from "@/components/widgets/clock";
import { Confirmation } from "@/components/widgets/confirmation";
import FeedbackForbidden from "@/components/widgets/feedback-forbidden";
import FeedbackNoData from "@/components/widgets/feedback-no-data";
import FeedbackNotFound from "@/components/widgets/feedback-not-found";
import FeedbackRetry from "@/components/widgets/feedback-retry";
import { LucideIcon } from "@/components/widgets/icon";
import { ConstrainedContainer } from "@/components/widgets/view";
import { PDFViewer } from "@/components/widgets/pdf-viewer";
import SelectWorkspaceCategory from "@/components/widgets/select-workspace-category";
import { Today } from "@/components/widgets/today";
import VideoPlayer from "@/components/widgets/video-player";
import { FormattedTableRow } from "@/constants/interfaces";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import { MENU_ICON_BOX_SIZE } from "@/constants/styles";
import { useLocale } from "@/contexts/useLocale";
import useRenderTrigger from "@/contexts/useRenderTrigger";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { useRequest } from "@/hooks/useRequest";
import { back } from "@/utils/client";
import { capitalize } from "@/utils/string";
import { HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { useFormik } from "formik";
import { PencilIcon, RefreshCcwDotIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import * as yup from "yup";
import { DataTable } from "@/components/widgets/data-table";
import { Menu } from "@/components/ui/menu";

// TODO_DEV delete this component

const Delete = (props: any) => {
  const ID = `delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { t } = useLocale();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${t.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${t.delete_} ${routeTitle} ${t.successful}`),
    },
  });

  // Utils
  function onDeactivate() {
    back();
    req({
      config: {
        url: `/delete`,
        method: "DELETE",
        data: {
          deleteIds: deleteIds,
        },
      },
      onResolve: {
        onSuccess: () => {
          setRt((ps) => !ps);
          clearSelectedRows?.();
        },
      },
    });
  }

  return (
    <Confirmation.Trigger
      w={"full"}
      id={`${ID}-${deleteIds}`}
      title={`${t.delete_} ${routeTitle}`}
      description={t.msg_soft_delete}
      confirmLabel={`${t.delete_}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        colorPalette: "gray",
        variant: "outline",
        color: "fg.error",
      }}
      loading={loading}
      disabled={disabled}
    >
      <Tooltip
        content={t.delete_}
        positioning={{
          placement: "right",
        }}
      >
        <Menu.Item
          value={"delete"}
          disabled={disabled}
          color={"fg.error"}
          transition={"200ms"}
        >
          {t.delete_}
          <Icon boxSize={MENU_ICON_BOX_SIZE} ml={"auto"}>
            <LucideIcon icon={TrashIcon} />
          </Icon>
        </Menu.Item>
      </Tooltip>
    </Confirmation.Trigger>
  );
};

const DemoDataTable = () => {
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
        icon: PencilIcon,
        onClick: () => console.log("Edit"),
      }),
      () => ({
        label: "Restore",
        icon: RefreshCcwDotIcon,
        onClick: () => console.log("Restore"),
      }),
      (row: FormattedTableRow<any>) => ({
        override: (
          <Delete
            deleteIds={[row.data.id]}
            disabled={!!row.data.deletedAt}
            routeTitle={"User"}
          />
        ),
      }),
    ],
    batchOptions: [
      (ids: string[]) => ({
        label: "Restore",
        icon: RefreshCcwDotIcon,
        onClick: () => console.log("Restore", ids),
      }),
      (ids: string[]) => ({
        label: "Delete",
        icon: TrashIcon,
        menuItemProps: { color: "fg.error" },
        onClick: () => console.log("Delete", ids),
      }),
    ],
  };

  const [limit, setLimit] = useState<number>(15);
  const [page, setPage] = useState<number>(1);

  return (
    <DataTable.Display
      headers={tableProps.headers}
      rows={tableProps.rows}
      rowOptions={tableProps.rowOptions}
      batchOptions={tableProps.batchOptions}
      limit={limit}
      setLimit={setLimit}
      page={page}
      setPage={setPage}
      maxH={"400px"}
    />
  );
};

const DemoIndexRoute = () => {
  const toasters = [
    {
      label: "Success",
      type: "success",
      description:
        "Success description Officia minim ullamco id deserunt velit minim incididunt minim irure occaecat dolore nostrud do dolore. Eu laboris voluptate proident officia dolore veniam nostrud consequat aute dolore veniam. Dolore Lorem enim sunt quis.",
    },
    {
      label: "Error",
      type: "error",
      description: "Error description",
    },
    {
      label: "Warning",
      type: "warning",
      description: "Warning description",
    },
    {
      label: "Info",
      type: "info",
      description: "Info description",
    },
    {
      label: "Loading",
      type: "loading",
      description: "Loading description",
    },
  ];
  const existingFiles = [
    {
      id: "24",
      fileId: "9fab5f8f-b70f-438c-89e9-7ff2bda65001",
      fileName: "File A",
      filePath: "file/Z8f60265g6ienDZCrqi1z4sMX",
      fileUrl:
        "https://doc-mamura.exium.id/storage/file/Z8f60265g6ienDZCrqi1z4sMX",
      fileMimeType: "image/jpeg",
      fileSize: "668.01 kB",
      createdAt: "2025-08-19T06:11:54.000000Z",
      updatedAt: "2025-08-19T06:11:54.000000Z",
      deletedAt: null,
    },
    {
      id: "25",
      fileId: "9fab5f8f-b70f-438c-89e9-7ff2bda65001",
      fileName: "File B",
      filePath: "file/Z8f60265g6ienDZCrqi1z4sMX",
      fileUrl:
        "https://doc-mamura.exium.id/storage/file/Z8f60265g6ienDZCrqi1z4sMX",
      fileMimeType: "image/jpeg",
      fileSize: "668.01 kB",
      deletedAt: null,
      createdAt: "2025-08-19T06:11:54.000000Z",
      updatedAt: "2025-08-19T06:11:54.000000Z",
    },
  ];
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      string: "",
      password: "",
      search: "",
      textarea: "",
      number: null as any,
      number2: 1.2,
      period: null as any,
      date: null as any,
      time: null as any,
      dateTime: "2025-09-06T00:00:00.000Z",
      select: null as any,
      multiSelect: null as any,
      file: null as any,
      file2: null as any,
      richEditor: null as any,
    },
    validationSchema: yup.object({
      string: yup.string().required(),
      password: yup.string().required(),
      search: yup.string().required(),
      textarea: yup.string().required(),
      number: yup.number().required(),
      number2: yup.number().required(),
      period: yup.object().required(),
      date: yup.array().required(),
      time: yup.string().required(),
      dateTime: yup.string().required(),
      select: yup.array().required(),
      multiSelect: yup.array().required(),
      file: yup.array().required(),
      richEditor: yup.string(),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { themeConfig } = useThemeConfig();

  return (
    <ConstrainedContainer bg={"bg.body"} maxW={"1280px"} p={4} gap={8}>
      <HStack
        justify={"space-between"}
        position={"sticky"}
        top={0}
        zIndex={1000}
      >
        <HStack gap={4}>
          <P whiteSpace={"nowrap"} fontSize={"xl"} fontWeight={"bold"}>
            Demo
          </P>
        </HStack>

        <HStack>
          <Calendar.Trigger>
            <Today />
          </Calendar.Trigger>
          <Clock />
          <LangMenu />
          <ColorModeButton />
        </HStack>
      </HStack>

      <NavLink to={"/welcome"}>
        <Btn colorPalette={themeConfig.colorPalette}>App Layout</Btn>
      </NavLink>

      <>
        <SimpleGrid columns={[1, null, 2]} gap={8}>
          <CContainer gap={4}>
            <HStack wrap={"wrap"}>
              {toasters.map((toast) => (
                <Btn
                  key={toast.label}
                  onClick={() => {
                    toaster.create({
                      type: toast.type,
                      title: toast.label,
                      description: toast.description,
                      // action: {
                      //   label: "Action",
                      //   onClick: () => {
                      //     console.log("action");
                      //   },
                      // },
                    });
                  }}
                  variant={"outline"}
                >
                  {toast.label}
                </Btn>
              ))}
            </HStack>

            <form id={"test"} onSubmit={formik.handleSubmit}>
              <CContainer gap={4}>
                <Field invalid={!!formik.errors.string}>
                  <StringInput
                    inputValue={formik.values.string}
                    onChange={(input) => {
                      formik.setFieldValue("string", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.password}>
                  <PasswordInput
                    inputValue={formik.values.password}
                    onChange={(input) => {
                      formik.setFieldValue("password", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.search}>
                  <SearchInput
                    inputValue={formik.values.search}
                    onChange={(input) => {
                      formik.setFieldValue("search", input);
                    }}
                    queryKey={"q-demo"}
                  />
                </Field>

                <Field invalid={!!formik.errors.textarea}>
                  <TextareaInput
                    inputValue={formik.values.textarea}
                    onChange={(input) => {
                      formik.setFieldValue("textarea", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.number}>
                  <NumInput
                    inputValue={formik.values.number}
                    onChange={(input) => {
                      formik.setFieldValue("number", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.number2}>
                  <NumInput
                    integer={false}
                    // locale={"en-US"}
                    inputValue={formik.values.number2}
                    onChange={(input) => {
                      formik.setFieldValue("number2", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.period}>
                  <PeriodPickerInput
                    inputValue={formik.values.period}
                    onChange={(input) => {
                      formik.setFieldValue("period", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.date}>
                  <DatePickerInput
                    inputValue={formik.values.date}
                    onChange={(input) => {
                      formik.setFieldValue("date", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.time}>
                  <TimePickerInput
                    inputValue={formik.values.time}
                    onChange={(input) => {
                      formik.setFieldValue("time", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.dateTime}>
                  <DateTimePickerInput
                    inputValue={formik.values.dateTime}
                    onChange={(input) => {
                      formik.setFieldValue("dateTime", input);
                    }}
                  />
                </Field>

                <Field invalid={!!formik.errors.select}>
                  <SelectInput
                    id={"select-single"}
                    title={"Agama"}
                    inputValue={formik.values.select}
                    onChange={(input) => {
                      formik.setFieldValue("select", input);
                    }}
                    selectOptions={OPTIONS_RELIGION}
                  />
                </Field>

                <Field invalid={!!formik.errors.multiSelect}>
                  <SelectInput
                    id={"select-multiple"}
                    title={"Agama"}
                    inputValue={formik.values.multiSelect}
                    onChange={(input) => {
                      formik.setFieldValue("multiSelect", input);
                    }}
                    selectOptions={OPTIONS_RELIGION}
                    multiple
                  />
                </Field>

                <Field invalid={!!formik.errors.select}>
                  <SelectWorkspaceCategory
                    id={"select-workspace-category"}
                    inputValue={formik.values.select}
                    onChange={(input) => {
                      formik.setFieldValue("select", input);
                    }}
                  />
                </Field>

                <Field label={"Dokumen Negara"} invalid={!!formik.errors.file}>
                  <FileInput
                    inputValue={formik.values.file2}
                    onChange={(input) => {
                      formik.setFieldValue("file2", input);
                    }}
                    existingFiles={existingFiles}
                    maxFiles={5}
                  />
                </Field>

                <Field label={"Dokumen Negara"} invalid={!!formik.errors.file}>
                  <FileInput
                    dropzone
                    inputValue={formik.values.file}
                    onChange={(input) => {
                      formik.setFieldValue("file", input);
                    }}
                    existingFiles={existingFiles}
                    maxFiles={5}
                  />
                </Field>
              </CContainer>
            </form>

            <Btn type={"submit"} form={"test"}>
              Submit
            </Btn>
          </CContainer>

          <CContainer gap={4}>
            <Field invalid={!!formik.errors.richEditor}>
              <TinyMceRichEditor
                inputValue={formik.values.richEditor}
                onChange={(input) => {
                  formik.setFieldValue("richEditor", input);
                }}
              />
            </Field>

            <VideoPlayer
              src={
                "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              }
            />
          </CContainer>
        </SimpleGrid>

        <SimpleGrid columns={[1, null, 2]} gap={8}>
          <CContainer rounded={"md"} border={"1px solid {colors.border.muted}"}>
            <FeedbackNoData />
          </CContainer>

          <CContainer rounded={"md"} border={"1px solid {colors.border.muted}"}>
            <FeedbackNotFound />
          </CContainer>

          <CContainer rounded={"md"} border={"1px solid {colors.border.muted}"}>
            <FeedbackForbidden />
          </CContainer>

          <CContainer rounded={"md"} border={"1px solid {colors.border.muted}"}>
            <FeedbackRetry />
          </CContainer>
        </SimpleGrid>

        <CContainer border={"1px solid"} borderColor={"border.muted"}>
          <DemoDataTable />
        </CContainer>

        <SimpleGrid columns={[1, null, 2]} gap={4}>
          <CContainer>
            <PDFViewer fileUrl={"/test.pdf"} maxH={"600px"} />
          </CContainer>

          <CContainer>
            <iframe
              src={"/test.pdf#page=2&zoom=120"}
              style={{ width: "100%", height: "100vh", border: "none" }}
            />
          </CContainer>
        </SimpleGrid>
      </>
    </ConstrainedContainer>
  );
};

export default DemoIndexRoute;
