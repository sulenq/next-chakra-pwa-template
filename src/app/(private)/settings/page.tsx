"use client";

import { StackV } from "@/components/ui/stack";
import FeedbackState from "@/components/widgets/feedback-state";
import { LucideIcon } from "@/components/widgets/icon";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { SettingsIcon } from "lucide-react";

const SettingsRoute = () => {
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
        icon={<LucideIcon icon={SettingsIcon} />}
        description={t.msg_settings_index_route}
      />
    </StackV>
  );
};
export default SettingsRoute;
