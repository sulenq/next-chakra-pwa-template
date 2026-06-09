"use client";

import { StackV } from "@/components/ui/stack";
import FeedbackState from "@/components/feedback/feedback-state";
import { LucideIcon } from "@/components/misc/icon";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { SettingsIcon } from "lucide-react";

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
        icon={<LucideIcon icon={SettingsIcon} />}
        description={t.msg_settings_index_route}
      />
    </StackV>
  );
}
