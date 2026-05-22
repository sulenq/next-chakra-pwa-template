"use client";

import FeedbackState from "@/components/feedback/feedback-state";
import { LucideIcon } from "@/components/misc/icon";
import { StackV } from "@/components/ui/stack";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { ServerIcon } from "lucide-react";

export default function SettingsRoute() {
  // Contexts
  const { t } = useLocaleContext();
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
