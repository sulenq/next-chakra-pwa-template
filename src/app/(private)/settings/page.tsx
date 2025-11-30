"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widget/FeedbackState";
import { LucideIcon } from "@/components/widget/Icon";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { SettingsIcon } from "lucide-react";

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
        icon={<LucideIcon icon={SettingsIcon} />}
        title={l.settings}
        description={l.msg_settings_index_route}
      />
    </CContainer>
  );
};
export default SettingsRoute;
