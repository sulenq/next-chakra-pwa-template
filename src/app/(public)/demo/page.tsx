"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { DateTimePickerInput } from "@/components/ui/date-time-picker-input";
import { Field } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import { LangMenu } from "@/components/ui/lang-menu";
import { MenuItem } from "@/components/ui/menu";
import { NavLink } from "@/components/ui/nav-link";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import { RichEditor } from "@/components/ui/RichEditor";
import SearchInput from "@/components/ui/search-input";
import { SelectInput } from "@/components/ui/select-input";
import { StringInput } from "@/components/ui/string-input";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { toaster } from "@/components/ui/toaster";
import Clock from "@/components/widget/Clock";
import { ConfirmationDisclosureTrigger } from "@/components/widget/ConfirmationDisclosure";
import { DataTable } from "@/components/widget/DataTable";
import FeedbackForbidden from "@/components/widget/FeedbackForbidden";
import FeedbackNoData from "@/components/widget/FeedbackNoData";
import FeedbackNotFound from "@/components/widget/FeedbackNotFound";
import FeedbackRetry from "@/components/widget/FeedbackRetry";
import { LucideIcon } from "@/components/widget/Icon";
import { PDFViewer } from "@/components/widget/PDFViewer";
import { RowOptionMenuTooltip } from "@/components/widget/RowOptions";
import SelectWorkspaceCategory from "@/components/widget/SelectWorkspaceCategory";
import { Today } from "@/components/widget/Today";
import VideoPlayer from "@/components/widget/VideoPlayer";
import { Interface__FormattedTableRow } from "@/constants/interfaces";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import { MENU_ICON_BOX_SIZE } from "@/constants/styles";
import useLang from "@/context/useLang";
import useRenderTrigger from "@/context/useRenderTrigger";
import { useThemeConfig } from "@/context/useThemeConfig";
import useRequest from "@/hooks/useRequest";
import { back } from "@/utils/client";
import { capitalize } from "@/utils/string";
import { HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { IconPencilMinus, IconRestore, IconTrash } from "@tabler/icons-react";
import { useFormik } from "formik";
import { TrashIcon } from "lucide-react";
import { useState } from "react";
import * as yup from "yup";

const Delete = (props: any) => {
  const ID = `delete`;

  // Props
  const { deleteIds, clearSelectedRows, disabled, routeTitle } = props;

  // Contexts
  const { l } = useLang();
  const setRt = useRenderTrigger((s) => s.setRt);

  // Hooks
  const { req, loading } = useRequest({
    id: ID,
    loadingMessage: {
      title: capitalize(`${l.delete_} ${routeTitle}`),
    },
    successMessage: {
      title: capitalize(`${l.delete_} ${routeTitle} ${l.successful}`),
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
    <ConfirmationDisclosureTrigger
      w={"full"}
      id={`${ID}-${deleteIds}`}
      title={`${l.delete_} ${routeTitle}`}
      description={l.msg_soft_delete}
      confirmLabel={`${l.delete_}`}
      onConfirm={onDeactivate}
      confirmButtonProps={{
        variant: "outline",
        _hover: {
          color: "fg.error",
        },
      }}
      loading={loading}
      disabled={disabled}
    >
      <RowOptionMenuTooltip content={l.delete_}>
        <MenuItem
          value="delete"
          disabled={disabled}
          _hover={{
            color: "fg.error",
          }}
          transition={"200ms"}
        >
          {l.delete_}
          <Icon boxSize={MENU_ICON_BOX_SIZE} ml={"auto"}>
            <LucideIcon icon={TrashIcon} />
          </Icon>
        </MenuItem>
      </RowOptionMenuTooltip>
    </ConfirmationDisclosureTrigger>
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
    ],
    rowOptions: [
      () => ({
        label: "Edit",
        icon: <IconPencilMinus stroke={1.5} />,
        onClick: () => console.log("Edit"),
      }),
      () => ({
        label: "Restore",
        icon: <IconRestore stroke={1.5} />,
        onClick: () => console.log("Restore"),
      }),
      (row: Interface__FormattedTableRow<any>) => ({
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
      deletedAt: null,
      createdAt: "2025-08-19T06:11:54.000000Z",
      updatedAt: "2025-08-19T06:11:54.000000Z",
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
      number2: null as any,
      period: null as any,
      date: null as any,
      time: null as any,
      dateTime: "2025-09-06T00:00:00.000Z",
      select: null as any,
      multiSelect: null as any,
      file: null as any,
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
    <CContainer p={4} gap={8} mx={"auto"}>
      <HStack justify={"space-between"}>
        <HStack gap={4}>
          <P whiteSpace={"nowrap"} fontSize={"xl"} fontWeight={"bold"}>
            Demo
          </P>
        </HStack>

        <HStack>
          <Today />
          <Clock showTimezone />
          <LangMenu />
          <ColorModeButton />
        </HStack>
      </HStack>

      <NavLink to="/welcome">
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

            <form id="test" onSubmit={formik.handleSubmit}>
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
                    queryKey={"q_demo"}
                  />
                </Field>

                <Field invalid={!!formik.errors.textarea}>
                  <Textarea
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
                    inputValue={formik.values.number2}
                    onChange={(input) => {
                      formik.setFieldValue("number2", input);
                    }}
                    placeholder="Input number decimal"
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
                    id="select-single"
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
                    id="select-multiple"
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

            <Btn type={"submit"} form="test">
              Submit
            </Btn>
          </CContainer>

          <CContainer gap={4}>
            <Field invalid={!!formik.errors.richEditor}>
              <RichEditor
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

        <SimpleGrid columns={[1, null, 2]}>
          <CContainer>
            <PDFViewer fileUrl={`/assets/dummy-pdf.pdf`} flex={1} />
          </CContainer>
        </SimpleGrid>
      </>
    </CContainer>
  );
};

export default DemoIndexRoute;
