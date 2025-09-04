"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { Field } from "@/components/ui/field";
import FileInput from "@/components/ui/file-input";
import { P } from "@/components/ui/p";
import { HStack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

const DocsIndexRoute = () => {
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      date: undefined as any,
      file: undefined as any,
    },
    validationSchema: yup.object({
      date: yup.array().required(),
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

      <form id="test" onSubmit={formik.handleSubmit}>
        <CContainer gap={4}>
          <Field invalid={!!formik.errors.date}>
            <DatePickerInput
              inputValue={formik.values.date}
              onConfirm={(input) => {
                formik.setFieldValue("date", input);
              }}
              multiple
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
