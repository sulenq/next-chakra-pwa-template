"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { DateTimePickerInput } from "@/components/ui/date-time-picker-input";
import { Field } from "@/components/ui/field";
import FileInput from "@/components/ui/file-input";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import { PeriodPickerInput } from "@/components/ui/period-picker-input";
import SearchInput from "@/components/ui/search-input";
import { SelectInput } from "@/components/ui/select-input";
import { StringInput } from "@/components/ui/string-input";
import TimePickerInput from "@/components/ui/time-picker-input";
import { toaster } from "@/components/ui/toaster";
import SelectPropertyByLayerId from "@/components/widget/SelectPropertyByLayerId";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import { HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

const DocsIndexRoute = () => {
  const toasters = [
    {
      label: "Success",
      type: "success",
      description: "Success description",
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
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      string: "",
      password: "",
      search: "",
      number: null as any,
      period: null as any,
      date: null as any,
      time: null as any,
      dateTime: "2025-09-06T00:00:00.000Z",
      select: null as any,
      multiSelect: null as any,
      file: null as any,
    },
    validationSchema: yup.object({
      string: yup.string().required(),
      password: yup.string().required(),
      search: yup.string().required(),
      number: yup.number().required(),
      period: yup.object().required(),
      date: yup.array().required(),
      time: yup.string().required(),
      dateTime: yup.string().required(),
      select: yup.array().required(),
      multiSelect: yup.array().required(),
      file: yup.array().required(),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <CContainer p={4} gap={8} maxW={"500px"} mx={"auto"}>
      <HStack justify={"space-between"}>
        <P fontSize={"xl"} fontWeight={"bold"}>
          Docs
        </P>

        <ColorModeButton />
      </HStack>

      <HStack wrap={"wrap"}>
        {toasters.map((toast) => (
          <Btn
            key={toast.label}
            onClick={() => {
              toaster.create({
                type: toast.type,
                title: toast.label,
                description: toast.description,
                action: {
                  label: "Close",
                  onClick: () => {
                    console.log("action");
                  },
                },
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

          <Field invalid={!!formik.errors.period}>
            <PeriodPickerInput
              inputValue={formik.values.period}
              onConfirm={(input) => {
                formik.setFieldValue("period", input);
              }}
            />
          </Field>

          <Field invalid={!!formik.errors.date}>
            <DatePickerInput
              inputValue={formik.values.date}
              onConfirm={(input) => {
                formik.setFieldValue("date", input);
              }}
            />
          </Field>

          <Field invalid={!!formik.errors.time}>
            <TimePickerInput
              inputValue={formik.values.time}
              onConfirm={(input) => {
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
              title={"Agama"}
              inputValue={formik.values.select}
              onConfirm={(input) => {
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
              onConfirm={(input) => {
                formik.setFieldValue("multiSelect", input);
              }}
              selectOptions={OPTIONS_RELIGION}
              multiple
            />
          </Field>

          <Field invalid={!!formik.errors.select}>
            <SelectPropertyByLayerId
              layerId={1}
              id="select-props-by-layer-id"
              inputValue={formik.values.select}
              onChange={(input) => {
                formik.setFieldValue("select", input);
              }}
            />
          </Field>

          <Field invalid={!!formik.errors.file}>
            <FileInput
              dropzone
              inputValue={formik.values.file}
              onChange={(input) => {
                formik.setFieldValue("file", input);
              }}
            />
          </Field>
        </CContainer>
      </form>

      <Btn type={"submit"} form="test">
        Submit
      </Btn>
    </CContainer>
  );
};

export default DocsIndexRoute;
