"use client";

import { useState } from "react";
import { useCreateLayananMutation } from "../hooks/use-layanan";
import { useLocale } from "@/contexts/use-locale-context";
import { Btn } from "@/components/ui/btn";
import { StackV } from "@/components/ui/stack";
import { SimpleDisclosure } from "@/components/widgets/simple-disclosure";
import { usePopDisclosure } from "@/hooks/use-pop-disclosure";
import { PlusIcon } from "lucide-react";
import { AppIconLucide } from "@/components/widgets/app-icon";

export const LayananCreate = () => {
  const { open, onOpen, onClose } = usePopDisclosure("layanan-create");
  const { mutate, isPending } = useCreateLayananMutation();
  const { t } = useLocale();

  const [titleId, setTitleId] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [descId, setDescId] = useState("");
  const [descEn, setDescEn] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

    mutate(formData, {
      onSuccess: () => {
        onClose();
        setTitleId("");
        setTitleEn("");
        setDescId("");
        setDescEn("");
        setFile(null);
      },
    });
  };

  return (
    <>
      <Btn iconButton onClick={onOpen} size={"sm"}>
        <AppIconLucide icon={PlusIcon} />
      </Btn>

      <SimpleDisclosure
        open={open}
        title={"Create Service"}
        bodyContent={
          <form id={"create-layanan-form"} onSubmit={handleSubmit}>
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
                required={true}
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
              form={"create-layanan-form"}
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
