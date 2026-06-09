import { Item, ItemRootProps } from "@/components/container/item";
import { useMainViewContext } from "@/components/container/main-view";
import { AvatarUploadTrigger } from "@/components/ui/avatar";
import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { HelperText } from "@/components/ui/typography";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { UserIdCard } from "@/components/user/user-id-card";
import { R_SPACING_MD } from "@/constants/styles";
import { ResetPasswordDisclosureTrigger } from "@/features/auth/components/reset-password";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { Stack } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// -----------------------------------------------------------------

export const PersonalInformationSection = (props: ItemRootProps) => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();
  const { isSmContainer } = useMainViewContext();

  // Constants
  const user = useAuthStore((s) => s.auth.user);

  // States
  const schema = z.object({
    avatar: z.any().nullable().optional(),
    deleteAvatarIds: z.array(z.string()).default([]),
    name: z.string().min(1, t.msg_required_form),
    email: z.string().min(1, t.msg_required_form),
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      avatar: null,
      deleteAvatarIds: [],
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = (values: any) => {};

  return (
    <Item.Root px={R_SPACING_MD} {...props}>
      <Item.Body p={4} overflow={"visible"}>
        <Stack flexDir={isSmContainer ? "column" : "row"}>
          <StackV minW={"280px"} pl={10} pr={8} pt={"28px"} pb={2}>
            <UserIdCard w={"220px"} mx={"auto"} />
          </StackV>

          <StackV flex={1} justify={"space-between"}>
            <form id={"personal-info-form"} onSubmit={handleSubmit(onSubmit)}>
              <FieldsetRoot>
                <Field
                  label={"Avatar"}
                  invalid={!!errors.avatar}
                  errorText={errors.avatar?.message as string}
                >
                  <StackV gap={2}>
                    <Controller
                      name="avatar"
                      control={control}
                      render={({ field }) => (
                        <AvatarUploadTrigger
                          value={field.value}
                          onChange={field.onChange}
                          user={user}
                          onDeleteFile={(fileData) => {
                            const currentIds = getValues("deleteAvatarIds");
                            setValue(
                              "deleteAvatarIds",
                              Array.from(new Set([...currentIds, fileData.id])),
                            );
                          }}
                          onUndoDeleteFile={(fileData) => {
                            const currentIds = getValues("deleteAvatarIds");
                            setValue(
                              "deleteAvatarIds",
                              currentIds.filter((id) => id !== fileData.id),
                            );
                          }}
                        >
                          <Btn w={"fit"} variant={"outline"}>
                            {t.upload_new_avatar}
                          </Btn>
                        </AvatarUploadTrigger>
                      )}
                    />

                    <StackV gap={1}>
                      <HelperText>{t.msg_new_avatar_helper}</HelperText>
                      <HelperText>{`PNG, JPG ${t.is_allowed}`}</HelperText>
                    </StackV>
                  </StackV>
                </Field>

                <Field
                  label={t.name}
                  invalid={!!errors.name}
                  errorText={errors.name?.message as string}
                >
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <StringInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={"Jolitos Kurniawan"}
                      />
                    )}
                  />
                </Field>

                <Field
                  label={"Email"}
                  invalid={!!errors.email}
                  errorText={errors.email?.message as string}
                >
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <StringInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={"example@email.com"}
                      />
                    )}
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
