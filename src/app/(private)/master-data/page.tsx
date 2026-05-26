"use client";

import FeedbackState from "@/components/feedback/feedback-state";
import { LucideIcon } from "@/components/misc/icon";
import { StackV } from "@/components/ui/stack";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { ServerIcon } from "lucide-react";

export default function SettingsRoute() {
  // Stores
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  return (
    <StackV
      flex={1}
      align={"center"}
      justify={"center"}
      p={4}
      mb={4}
      rounded={theme.radii.container}
    >
      <FeedbackState
        icon={<LucideIcon icon={ServerIcon} />}
        description={t.msg_master_data_index_route}
      />
    </StackV>
  );
}
