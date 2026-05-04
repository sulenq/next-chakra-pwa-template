"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widgets/feedback-state";
import { LucideIcon } from "@/components/widgets/icon";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeConfig } from "@/contexts/use-theme-context";
import { ServerIcon } from "lucide-react";

const SettingsRoute = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeConfig();

  return (
    <CContainer
      flex={1}
      align={"center"}
      justify={"center"}
      bg={"bg.body"}
      p={4}
      mb={4}
      rounded={themeContext.radii.container}
    >
      <FeedbackState
        icon={<LucideIcon icon={ServerIcon} />}
        title={"Master Data"}
        description={t.msg_master_data_index_route}
      />
    </CContainer>
  );
};
export default SettingsRoute;
