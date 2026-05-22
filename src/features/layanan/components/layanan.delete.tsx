"use client";

import { Menu } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/branding/app-icon";
import { Confirmation } from "@/components/overlays/confirmation";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { TrashIcon } from "lucide-react";
import { useDeleteLayanan } from "../hooks/use-layanan";
import { usePathname } from "next/navigation";
import { getMainViewTitle } from "@/utils/route";

interface Props {
  ids: (string | number)[];
  clearSelectedRows?: () => void;
  disabled?: boolean;
}

export const LayananDelete = ({ ids, clearSelectedRows, disabled }: Props) => {
  // Store
  const { t } = useLocaleStore();

  // Hooks
  const pathname = usePathname();

  // Query
  const { mutate, isPending } = useDeleteLayanan();

  // Constants
  const mainViewTitle = getMainViewTitle(pathname, t);

  // Utils
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
      title={`${t.delete_} ${mainViewTitle}`}
      description={t.msg_hard_delete}
      confirmLabel={t.delete_}
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
      <Tooltip
        content={t.delete_}
        positioning={{
          placement: "left",
        }}
      >
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
