"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widgets/FeedbackState";
import { LucideIcon } from "@/components/widgets/Icon";
import useLang from "@/contexts/useLang";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { ServerIcon } from "lucide-react";

const SettingsRoute = () => {
  // Contexts
  const { t } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      flex={1}
      align={"center"}
      justify={"center"}
      bg={"body"}
      p={4}
      mb={4}
      rounded={themeConfig.radii.container}
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
