"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { DatabaseIcon } from "lucide-react";

const SettingsRoute = () => {
  // Contexts
  const { l } = useLang();
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
        icon={<LucideIcon icon={DatabaseIcon} />}
        title={"Master Data"}
        description={l.msg_master_data_index_route}
      />
    </CContainer>
  );
};
export default SettingsRoute;
