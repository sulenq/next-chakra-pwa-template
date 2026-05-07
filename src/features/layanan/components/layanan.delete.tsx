"use client";

import { Menu } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { Confirmation } from "@/components/widgets/confirmation";
import { useLocale } from "@/contexts/use-locale-context";
import { TrashIcon } from "lucide-react";
import { useDeleteLayananMutation } from "../hooks/use-layanan";

interface Props {
  ids: (string | number)[];
  clearSelectedRows?: () => void;
  disabled?: boolean;
}

export const LayananDelete = ({ ids, clearSelectedRows, disabled }: Props) => {
  const { mutate, isPending } = useDeleteLayananMutation();
  const { t } = useLocale();

  const handleDelete = () => {
    mutate(ids, {
      onSuccess: () => {
        clearSelectedRows?.();
      },
    });
  };

  return (
    <Confirmation.Trigger
      id={`delete-layanan-${ids.join("-")}`}
      title={t.delete_ || "Delete"}
      description={t.msg_soft_delete || "Are you sure you want to delete?"}
      confirmLabel={t.delete_ || "Delete"}
      onConfirm={handleDelete}
      confirmButtonProps={{
        colorPalette: "gray",
        variant: "outline",
        color: "fg.error",
      }}
      loading={isPending}
      disabled={disabled}
      w={"full"}
    >
      <Tooltip content={t.delete_ || "Delete"}>
        <Menu.Item
          value={"delete"}
          color={"fg.error"}
          disabled={disabled}
          justifyContent={"space-between"}
        >
          {t.delete_}
          <AppIconLucide icon={TrashIcon} />
        </Menu.Item>
      </Tooltip>
    </Confirmation.Trigger>
  );
};
