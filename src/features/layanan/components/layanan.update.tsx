"use client";

import { useState, useEffect } from "react";
import { useUpdateLayananMutation } from "../hooks/use-layanan";
import { useLocale } from "@/contexts/use-locale-context";
import { Btn } from "@/components/ui/btn";
import { StackV } from "@/components/ui/stack";
import { SimpleDisclosure } from "@/components/widgets/simple-disclosure";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { EditIcon } from "lucide-react";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { LayananItem } from "../types/layanan.types";
import { Tooltip } from "@/components/ui/tooltip";
import { Menu } from "@/components/ui/menu";

interface Props {
  item: LayananItem;
}

export const LayananUpdate = ({ item }: Props) => {
  const { open, onOpen, onClose } = usePopDisclosure(
    `layanan-update-${item.id}`,
  );
  const { mutate, isPending } = useUpdateLayananMutation();
  const { t } = useLocale();

  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (open) {
      setTitleId(item.title?.id || "");
      setTitleEn(item.title?.en || "");
      setDescId(item.description?.id || "");
      setDescEn(item.description?.en || "");
      setFile(null);
    }
  }, [open, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title_id", titleId);
    formData.append("title_en", titleEn);
    formData.append("description_id", descId);
    formData.append("description_en", descEn);
    if (file) {
      formData.append("file", file);
    }

    mutate(
      { id: item.id, data: formData },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <>
      <Tooltip content={"Edit"}>
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
        title={"Update Service"}
        bodyContent={
          <form id={`update-layanan-form-${item.id}`} onSubmit={handleSubmit}>
            <StackV gap={4} p={4}>
              <input
                placeholder={"Title (ID)"}
                value={titleId}
                onChange={(e) => setTitleId(e.target.value)}
                required={true}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                placeholder={"Title (EN)"}
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                required={true}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <textarea
                placeholder={"Description (ID)"}
                value={descId}
                onChange={(e) => setDescId(e.target.value)}
                required={true}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <textarea
                placeholder={"Description (EN)"}
                value={descEn}
                onChange={(e) => setDescEn(e.target.value)}
                required={true}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type={"file"}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </StackV>
          </form>
        }
        footerContent={
          <>
            <Btn variant={"outline"} onClick={onClose}>
              {t?.cancel || "Cancel"}
            </Btn>
            <Btn
              type={"submit"}
              form={`update-layanan-form-${item.id}`}
              loading={isPending}
            >
              {t?.save || "Save"}
            </Btn>
          </>
        }
      />
    </>
  );
};
