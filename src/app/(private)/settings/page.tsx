"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widgets/feedback-state";
import { LucideIcon } from "@/components/widgets/icon";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeConfig } from "@/contexts/use-theme-context";
import { SettingsIcon } from "lucide-react";

const SettingsRoute = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      flex={1}
      align={"center"}
      justify={"center"}
      p={4}
      mb={4}
      rounded={themeConfig.radii.container}
    >
      <FeedbackState
        icon={<LucideIcon icon={SettingsIcon} />}
        title={t.settings}
        description={t.msg_settings_index_route}
      />
    </CContainer>
  );
};
export default SettingsRoute;
