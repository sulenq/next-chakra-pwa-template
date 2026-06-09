"use client";

import { Item } from "@/components/container/item";
import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { SettingsHelperText } from "@/components/ui/typography";
import { PasswordInput } from "@/components/ui/password-input";
import { StackH } from "@/components/ui/stack";
import { SPACING_MD } from "@/constants/styles";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export const APIKeySection = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // States
  const schema = z.object({
    mapboxToken: z.string().min(1, t.msg_required_form),
    tinyMceToken: z.string().min(1, t.msg_required_form),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mapboxToken: "",
      tinyMceToken: "",
    },
  });

  const onSubmit = (values: any) => {};

  return (
    <Item.Root px={SPACING_MD}>
      <SettingsHelperText>API Keys</SettingsHelperText>

      <Item.Body p={4}>
        <form id={"api-keys-form"} onSubmit={handleSubmit(onSubmit)}>
          <FieldsetRoot>
            <Field
              label={"Mapbox Token"}
              invalid={!!errors.mapboxToken}
              errorText={errors.mapboxToken?.message as string}
            >
              <Controller
                name="mapboxToken"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </Field>

            <Field
              label={"Tiny MCE Token"}
              invalid={!!errors.tinyMceToken}
              errorText={errors.tinyMceToken?.message as string}
            >
              <Controller
                name="tinyMceToken"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
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
