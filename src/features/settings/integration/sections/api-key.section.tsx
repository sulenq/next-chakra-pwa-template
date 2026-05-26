"use client";

import { Item } from "@/components/container/item";
import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { PasswordInput } from "@/components/ui/password-input";
import { StackH } from "@/components/ui/stack";
import { R_SPACING_MD } from "@/constants/styles";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useFormik } from "formik";
import * as yup from "yup";

export const APIKeySection = () => {
  // Store
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      mapboxToken: "",
      tinyMceToken: "",
    },
    validationSchema: yup.object().shape({
      mapboxToken: yup.string().required(t.msg_required_form),
      tinyMceToken: yup.string().required(t.msg_required_form),
    }),
    onSubmit: () => {},
  });

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText>API Keys</SettingsHelperText>

      <Item.Body p={4}>
        <form id={"api-keys-form"} onSubmit={formik.handleSubmit}>
          <FieldsetRoot>
            <Field
              label={"Mapbox Token"}
              invalid={!!formik.errors.mapboxToken}
              errorText={formik.errors.mapboxToken as string}
            >
              <PasswordInput
                inputValue={formik.values.mapboxToken}
                onChange={(inputValue) => {
                  formik.setFieldValue("mapboxToken", inputValue);
                }}
              />
            </Field>

            <Field
              label={"Tiny MCE Token"}
              invalid={!!formik.errors.tinyMceToken}
              errorText={formik.errors.tinyMceToken as string}
            >
              <PasswordInput
                inputValue={formik.values.tinyMceToken}
                onChange={(inputValue) => {
                  formik.setFieldValue("tinyMceToken", inputValue);
                }}
              />
            </Field>
          </FieldsetRoot>
        </form>

        <StackH align={"center"} justify={"end"} mt={8}>
          <Btn
            type={"submit"}
            form={"api-keys-form"}
            colorPalette={theme.colorPalette}
          >
            {t.save}
          </Btn>
        </StackH>
      </Item.Body>
    </Item.Root>
  );
};
