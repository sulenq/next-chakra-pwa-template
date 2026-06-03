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
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { InputGroup } from "@chakra-ui/react";
import { toFormData } from "axios";
import { useFormik } from "formik";
import { EditIcon } from "lucide-react";
import * as yup from "yup";
import { useUpdateLayanan } from "../hooks/use-layanan";
import { LayananItem } from "../types/layanan.types";
import { getMainViewTitle } from "@/utils/route";
import { usePathname } from "next/navigation";

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
  const formik = useFormik({
    initialValues: {
      title_id: item.title?.id || "",
      title_en: item.title?.en || "",
      description_id: item.description?.id || "",
      description_en: item.description?.en || "",
      file: null as File | null,
    },
    enableReinitialize: true,
    validationSchema: yup.object().shape({
      title_id: yup.string().required(t.msg_required_form || "Required"),
      title_en: yup.string().required(t.msg_required_form || "Required"),
      description_id: yup.string().required(t.msg_required_form || "Required"),
      description_en: yup.string().required(t.msg_required_form || "Required"),
    }),
    onSubmit: (values) => {
      // const formData = new FormData();
      // formData.append("title_id", values.title_id);
      // formData.append("title_en", values.title_en);
      // formData.append("description_id", values.description_id);
      // formData.append("description_en", values.description_en);
      // if (values.file) {
      //   formData.append("file", values.file);
      // }

      const payload = values;

      mutate(
        { id: item.id, data: toFormData(payload) },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    },
  });

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
            onSubmit={formik.handleSubmit}
          >
            <FieldsetRoot disabled={isPending}>
              <Field
                label={t.title || "Title"}
                invalid={!!formik.errors.title_id && !!formik.touched.title_id}
                errorText={formik.errors.title_id}
              >
                <InputGroup w={"full"} startElement={"ID"}>
                  <StringInput
                    name={"title_id"}
                    placeholder={t.title || "Title"}
                    inputValue={formik.values.title_id}
                    onChange={(val) => formik.setFieldValue("title_id", val)}
                    pl={"40px !important"}
                  />
                </InputGroup>
              </Field>

              <Field
                label={t.title || "Title"}
                invalid={!!formik.errors.title_en && !!formik.touched.title_en}
                errorText={formik.errors.title_en}
              >
                <InputGroup w={"full"} startElement={"EN"}>
                  <StringInput
                    name={"title_en"}
                    placeholder={t.title || "Title"}
                    inputValue={formik.values.title_en}
                    onChange={(val) => formik.setFieldValue("title_en", val)}
                    pl={"40px !important"}
                  />
                </InputGroup>
              </Field>

              <Field
                label={t.description || "Description"}
                invalid={
                  !!formik.errors.description_id &&
                  !!formik.touched.description_id
                }
                errorText={formik.errors.description_id}
              >
                <InputGroup w={"full"} startElement={"ID"}>
                  <TextareaInput
                    name={"description_id"}
                    placeholder={t.description || "Description"}
                    inputValue={formik.values.description_id}
                    onChange={(val) =>
                      formik.setFieldValue("description_id", val)
                    }
                    pl={"40px !important"}
                  />
                </InputGroup>
              </Field>

              <Field
                label={t.description || "Description"}
                invalid={
                  !!formik.errors.description_en &&
                  !!formik.touched.description_en
                }
                errorText={formik.errors.description_en}
              >
                <InputGroup w={"full"} startElement={"EN"}>
                  <TextareaInput
                    name={"description_en"}
                    placeholder={t.description || "Description"}
                    inputValue={formik.values.description_en}
                    onChange={(val) =>
                      formik.setFieldValue("description_en", val)
                    }
                    pl={"40px !important"}
                  />
                </InputGroup>
              </Field>

              <Field
                label={"Icon"}
                invalid={!!formik.errors.file && !!formik.touched.file}
                errorText={formik.errors.file as string}
              >
                <input
                  type={"file"}
                  onChange={(e) =>
                    formik.setFieldValue("file", e.target.files?.[0] || null)
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
