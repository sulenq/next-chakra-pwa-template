"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { DateTimePickerInput } from "@/components/ui/date-time-picker";
import { Field } from "@/components/ui/field";
import FileInput from "@/components/ui/file-input";
import { P } from "@/components/ui/p";
import { PasswordInput } from "@/components/ui/password-input";
import SearchInput from "@/components/ui/search-input";
import { StringInput } from "@/components/ui/string-input";
import TimePickerInput from "@/components/ui/time-picker-input";
import { HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

const DocsIndexRoute = () => {
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      string: "",
      password: "",
      search: "",
      date: undefined as any,
      dateTime: "",
      time: undefined as any,
      file: undefined as any,
    },
    validationSchema: yup.object({
      string: yup.string().required(),
      password: yup.string().required(),
      search: yup.string().required(),
      date: yup.array().required(),
      dateTime: yup.string().required(),
      time: yup.string().required(),
      file: yup.array().required(),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const dateTime = formik.values.dateTime;

  return (
    <CContainer p={4} gap={8} maxW={"500px"} mx={"auto"}>
      <HStack justify={"space-between"}>
        <P fontSize={"xl"} fontWeight={"bold"}>
          Docs
        </P>

        <ColorModeButton />
      </HStack>

      <CContainer>
        <P>{`${dateTime}`}</P>
      </CContainer>

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
              onConfirm={(input) => {
                formik.setFieldValue("dateTime", input);
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
