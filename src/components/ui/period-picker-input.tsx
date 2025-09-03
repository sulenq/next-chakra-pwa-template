"use client";

import { Props__PeriodPickerInput } from "@/constants/props";
import { Type__Period } from "@/constants/types";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import useBackOnClose from "@/hooks/useBackOnClose";
import { back } from "@/utils/client";
import { capitalizeWords } from "@/utils/string";
import {
  FieldRoot,
  HStack,
  Icon,
  SimpleGrid,
  useDisclosure,
  useFieldContext,
} from "@chakra-ui/react";
import { IconCheck } from "@tabler/icons-react";
import { useFormik } from "formik";
import { useEffect } from "react";
import * as yup from "yup";
import BackButton from "../widget/BackButton";
import { Btn } from "./btn";
import {
  DisclosureBody,
  DisclosureContent,
  DisclosureFooter,
  DisclosureHeader,
  DisclosureRoot,
} from "./disclosure";
import { DisclosureHeaderContent } from "./disclosure-header-content";
import { Field } from "./field";
import { NumInput } from "./number-input";
import { P } from "./p";
import { formatDate } from "@/utils/formatter";

export const PeriodPickerInput = (props: Props__PeriodPickerInput) => {
  // Props
  const {
    id,
    title,
    inputValue,
    onConfirm,
    placeholder,
    required,
    invalid,
    disclosureSize = "xs",
    multiple,
    ...restProps
  } = props;
  const resolvedId = id || `period-picker-input`;

  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
  const fc = useFieldContext();

  // Hooks
  const { open, onOpen, onClose } = useDisclosure();
  useBackOnClose(resolvedId, open, onOpen, onClose);

  // States
  const resolvedPlaceholder = placeholder || l.select_period;
  const MONTHS = [
    l.january,
    l.february,
    l.march,
    l.april,
    l.may,
    l.june,
    l.july,
    l.august,
    l.september,
    l.october,
    l.november,
    l.december,
  ];
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      month: null,
      year: null,
    } as Type__Period,
    validationSchema: yup.object().shape({
      month: yup.number().required(l.msg_required_form),
      year: yup.number().required(l.msg_required_form),
    }),
    onSubmit: (values) => {
      onConfirm?.({
        month: values.month,
        year: values.year,
      });
      back();
    },
  });
  const empty =
    inputValue && (inputValue?.year === null || inputValue?.month === null);

  // handle initial value
  useEffect(() => {
    if (open && inputValue) {
      formik.setValues({
        month: inputValue.month,
        year: inputValue.year,
      });
    }
  }, [open]);

  return (
    <>
      <Btn
        w={"full"}
        clicky={false}
        variant={"outline"}
        justifyContent={"start"}
        onClick={onOpen}
        borderColor={invalid ?? fc?.invalid ? "border.error" : "border.muted"}
        {...restProps}
      >
        {empty && <P color={"placeholder"}>{resolvedPlaceholder}</P>}

        {inputValue &&
          inputValue.year !== null &&
          inputValue.month !== null && (
            <P>
              {formatDate(new Date(inputValue.year, inputValue.month), {
                variant: "period",
              })}
            </P>
          )}
      </Btn>

      <DisclosureRoot open={open} lazyLoad size={disclosureSize}>
        <DisclosureContent>
          <DisclosureHeader>
            <DisclosureHeaderContent title={capitalizeWords(l.select_period)} />
          </DisclosureHeader>

          <DisclosureBody>
            <form id={resolvedId} onSubmit={formik.handleSubmit}>
              <FieldRoot gap={4}>
                <Field
                  label={l.year}
                  invalid={!!formik.errors.year}
                  errorText={formik.errors.year}
                >
                  <NumInput
                    inputValue={formik.values.year}
                    onChange={(inputValue) => {
                      formik.setFieldValue("year", inputValue);
                    }}
                  />
                </Field>

                <Field
                  label={l.month}
                  invalid={!!formik.errors.month}
                  errorText={formik.errors.month}
                >
                  <SimpleGrid w={"full"} columns={2} gap={2}>
                    {MONTHS.map((month, idx) => {
                      const active = formik.values.month === idx;

                      return (
                        <Btn
                          key={month}
                          clicky={false}
                          variant={"outline"}
                          onClick={() => {
                            formik.setFieldValue("month", idx);
                          }}
                        >
                          <HStack w={"full"} justify={"space-between"}>
                            {month}

                            {active && (
                              <Icon
                                color={themeConfig.primaryColor}
                                boxSize={5}
                              >
                                <IconCheck />
                              </Icon>
                            )}
                          </HStack>
                        </Btn>
                      );
                    })}
                  </SimpleGrid>
                </Field>
              </FieldRoot>
            </form>
          </DisclosureBody>

          <DisclosureFooter>
            <BackButton />

            <Btn
              type="submit"
              form={resolvedId}
              colorPalette={themeConfig.colorPalette}
            >
              {l.confirm}
            </Btn>
          </DisclosureFooter>
        </DisclosureContent>
      </DisclosureRoot>
    </>
  );
};
