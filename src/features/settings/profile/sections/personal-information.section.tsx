import { Item, ItemRootProps } from "@/components/container/item";
import { useMainViewContext } from "@/components/container/main-view";
import { AvatarUploadTrigger } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { HelperText } from "@/components/ui/helper-text";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { UserIdCard } from "@/components/user/user-id-card";
import { R_SPACING_MD } from "@/constants/styles";
import { ResetPasswordDisclosureTrigger } from "@/features/auth/components/reset-password";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { Stack } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";

// -----------------------------------------------------------------

export const PersonalInformationSection = (props: ItemRootProps) => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();
  const { isSmContainer } = useMainViewContext();

  // Constants
  const user = useAuthStore((s) => s.auth.user);

  // States
  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      avatar: null as any,
      deleteAvatarIds: [],
      name: user?.name,
      email: user?.email,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(t.msg_required_form),
      email: yup.string().required(t.msg_required_form),
    }),
    onSubmit: () => {},
  });

  return (
    <Item.Root px={R_SPACING_MD} {...props}>
      <Item.Body p={4} overflow={"visible"}>
        <Stack flexDir={isSmContainer ? "column" : "row"}>
          <StackV minW={"280px"} pl={10} pr={8} pt={"28px"} pb={2}>
            <UserIdCard w={"220px"} mx={"auto"} />
          </StackV>

          <StackV flex={1} justify={"space-between"}>
            <form id={"personal-info-form"} onSubmit={formik.handleSubmit}>
              <FieldsetRoot>
                <Field
                  label={"Avatar"}
                  invalid={!!formik.errors.avatar}
                  errorText={`${formik.errors.avatar}`}
                >
                  <StackV gap={2}>
                    <AvatarUploadTrigger formik={formik} user={user}>
                      <Btn w={"fit"} variant={"outline"}>
                        {t.upload_new_avatar}
                      </Btn>
                    </AvatarUploadTrigger>

                    <StackV gap={1}>
                      <HelperText>{t.msg_new_avatar_helper}</HelperText>
                      <HelperText>{`PNG, JPG ${t.is_allowed}`}</HelperText>
                    </StackV>
                  </StackV>
                </Field>

                <Field
                  label={t.name}
                  invalid={!!formik.errors.name}
                  errorText={`${formik.errors.name}`}
                >
                  <StringInput
                    inputValue={formik.values.name}
                    onChange={(inputValue) => {
                      formik.setFieldValue("name", inputValue);
                    }}
                    placeholder={"Jolitos Kurniawan"}
                  />
                </Field>

                <Field
                  label={"Email"}
                  invalid={!!formik.errors.email}
                  errorText={`${formik.errors.email}`}
                >
                  <StringInput
                    inputValue={formik.values.email}
                    onChange={(inputValue) => {
                      formik.setFieldValue("email", inputValue);
                    }}
                    placeholder={"example@email.com"}
                  />
                </Field>
              </FieldsetRoot>
            </form>

            <StackH justify={"space-between"} mt={8}>
              <ResetPasswordDisclosureTrigger>
                <Btn variant={"outline"}>Reset password</Btn>
              </ResetPasswordDisclosureTrigger>

              <Btn
                type={"submit"}
                form={"personal-info-form"}
                colorPalette={theme.colorPalette}
              >
                {t.save}
              </Btn>
            </StackH>
          </StackV>
        </Stack>
      </Item.Body>
    </Item.Root>
  );
};
