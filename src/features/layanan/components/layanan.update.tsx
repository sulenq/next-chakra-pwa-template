"use client";

import { Btn } from "@/components/ui/btn";
import { Field, FieldsetRoot } from "@/components/ui/field";
import { Menu } from "@/components/ui/menu";
import { StringInput } from "@/components/ui/string-input";
import { TextareaInput } from "@/components/ui/textarea-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/branding/app-icon";
import { SimpleDisclosure } from "@/components/overlays/simple-disclosure";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { InputGroup } from "@chakra-ui/react";
import { toFormData } from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EditIcon } from "lucide-react";
import { useUpdateLayanan } from "../hooks/use-layanan";
import { LayananItem } from "../types/layanan.types";
import { getMainViewTitle } from "@/utils/route";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface Props {
  item: LayananItem;
}

export const LayananUpdate = ({ item }: Props) => {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  // Hooks
  const { open, onOpen, onClose } = usePopDisclosure(
    `layanan-update-${item.id}`,
  );
  const pathname = usePathname();

  // Query
  const { mutate, isPending } = useUpdateLayanan();

  // States
  const schema = z.object({
    title_id: z.string().min(1, t.msg_required_form || "Required"),
    title_en: z.string().min(1, t.msg_required_form || "Required"),
    description_id: z.string().min(1, t.msg_required_form || "Required"),
    description_en: z.string().min(1, t.msg_required_form || "Required"),
    file: z.any().nullable().optional(),
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
      title_id: item.title?.id || "",
      title_en: item.title?.en || "",
      description_id: item.description?.id || "",
      description_en: item.description?.en || "",
      file: null as File | null,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title_id: item.title?.id || "",
        title_en: item.title?.en || "",
        description_id: item.description?.id || "",
        description_en: item.description?.en || "",
        file: null,
      });
    }
  }, [open, item, reset]);

  const onSubmit = (values: any) => {
    const payload = values;

    mutate(
      { id: item.id, data: toFormData(payload) },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  // Constants
  const mainViewTitle = getMainViewTitle(pathname, t);

  return (
    <>
      <Tooltip
        content={"Edit"}
        positioning={{
          placement: "left",
        }}
      >
        <Menu.Item
          value={"update"}
          onClick={onOpen}
          justifyContent={"space-between"}
        >
          Edit
          <AppIconLucide icon={EditIcon} />
        </Menu.Item>
      </Tooltip>

      <SimpleDisclosure
        open={open}
        title={`Edit ${mainViewTitle}`}
        bodyContent={
          <form
            id={`update-layanan-form-${item.id}`}
            onSubmit={handleSubmit(onSubmit)}
          >
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
                    setValue("file", e.target.files?.[0] || null, {
                      shouldValidate: true,
                    })
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
              form={`update-layanan-form-${item.id}`}
              loading={isPending}
              colorPalette={theme.colorPalette}
            >
              {t.save}
            </Btn>
          </>
        }
      />
    </>
  );
};
