"use client";

import FeedbackState from "@/components/feedback/feedback-state";
import { LucideIcon } from "@/components/misc/icon";
import { StackV } from "@/components/ui/stack";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { ServerIcon } from "lucide-react";

export default function SettingsRoute() {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext } = useThemeContext();

  return (
    <StackV
      flex={1}
      align={"center"}
      justify={"center"}
      p={4}
      mb={4}
      rounded={themeContext.radii.container}
    >
      <FeedbackState
        icon={<LucideIcon icon={ServerIcon} />}
        description={t.msg_master_data_index_route}
      />
    </StackV>
  );
}
