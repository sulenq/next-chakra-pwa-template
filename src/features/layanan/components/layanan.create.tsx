"use client";

import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { StringInput } from "@/components/ui/string-input";
import { TextareaInput } from "@/components/ui/textarea-input";
import { AppIconLucide } from "@/components/branding/app-icon";
import { SimpleDisclosure } from "@/components/overlays/simple-disclosure";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { InputGroup } from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { useCreateLayanan } from "../hooks/use-layanan";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";

export const LayananCreate = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { open, onOpen, onClose } = usePopDisclosure("layanan-create");

  // Query
  const { mutate, isPending } = useCreateLayanan();

  // States
  const schema = z.object({
    title_id: z.string().min(1, t.msg_required_form || "Required"),
    title_en: z.string().min(1, t.msg_required_form || "Required"),
    description_id: z.string().min(1, t.msg_required_form || "Required"),
    description_en: z.string().min(1, t.msg_required_form || "Required"),
    file: z.any().refine((val) => val !== null, { message: t.msg_required_form || "Required" }),
  });

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title_id: "",
      title_en: "",
      description_id: "",
      description_en: "",
      file: null as File | null,
    },
  });

  const onSubmit = (values: any) => {
    const formData = new FormData();
    formData.append("title_id", values.title_id);
    formData.append("title_en", values.title_en);
    formData.append("description_id", values.description_id);
    formData.append("description_en", values.description_en);
    if (values.file) {
      formData.append("file", values.file);
    }

    mutate(formData, {
      onSuccess: () => {
        onClose();
        reset();
      },
    });
  };

  return (
    <>
      <Btn
        iconButton
        onClick={onOpen}
        size={"sm"}
        colorPalette={theme.colorPalette}
      >
        <AppIconLucide icon={PlusIcon} />
      </Btn>

      <SimpleDisclosure
        open={open}
        title={"Create Service"}
        bodyContent={
          <form id={"create-layanan-form"} onSubmit={handleSubmit(onSubmit)}>
            <FieldsetRoot disabled={isPending}>
              <Field
                label={t.title || "Title"}
                invalid={!!errors.title_id}
                errorText={errors.title_id?.message as string}
              >
                <InputGroup w={"full"} startElement={"ID"}>
                  <Controller
                    name="title_id"
                    control={control}
                    render={({ field }) => (
                      <StringInput
                        name={field.name}
                        placeholder={t.title || "Title"}
                        value={field.value}
                        onChange={field.onChange}
                        pl={"40px !important"}
                      />
                    )}
                  />
                </InputGroup>
              </Field>

              <Field
                label={t.title || "Title"}
                invalid={!!errors.title_en}
                errorText={errors.title_en?.message as string}
              >
                <InputGroup w={"full"} startElement={"EN"}>
                  <Controller
                    name="title_en"
                    control={control}
                    render={({ field }) => (
                      <StringInput
                        name={field.name}
                        placeholder={t.title || "Title"}
                        value={field.value}
                        onChange={field.onChange}
                        pl={"40px !important"}
                      />
                    )}
                  />
                </InputGroup>
              </Field>

              <Field
                label={t.description || "Description"}
                invalid={!!errors.description_id}
                errorText={errors.description_id?.message as string}
              >
                <InputGroup w={"full"} startElement={"ID"}>
                  <Controller
                    name="description_id"
                    control={control}
                    render={({ field }) => (
                      <TextareaInput
                        name={field.name}
                        placeholder={t.description || "Description"}
                        value={field.value}
                        onChange={field.onChange}
                        pl={"40px !important"}
                      />
                    )}
                  />
                </InputGroup>
              </Field>

              <Field
                label={t.description || "Description"}
                invalid={!!errors.description_en}
                errorText={errors.description_en?.message as string}
              >
                <InputGroup w={"full"} startElement={"EN"}>
                  <Controller
                    name="description_en"
                    control={control}
                    render={({ field }) => (
                      <TextareaInput
                        name={field.name}
                        placeholder={t.description || "Description"}
                        value={field.value}
                        onChange={field.onChange}
                        pl={"40px !important"}
                      />
                    )}
                  />
                </InputGroup>
              </Field>

              <Field
                label={"Icon"}
                invalid={!!errors.file}
                errorText={errors.file?.message as string}
              >
                <input
                  type={"file"}
                  onChange={(e) =>
                    setValue("file", e.target.files?.[0] || null, { shouldValidate: true })
                  }
                />
              </Field>
            </FieldsetRoot>
          </form>
        }
        footerContent={
          <>
            <Btn variant={"outline"} onClick={onClose}>
              {t.cancel || "Cancel"}
            </Btn>

            <Btn
              type={"submit"}
              form={"create-layanan-form"}
              loading={isPending}
              colorPalette={theme.colorPalette}
            >
              {t.add}
            </Btn>
          </>
        }
      />
    </>
  );
};
