"use client";

import { CContainer } from "@/components/ui/c-container";
import FeedbackState from "@/components/widget/FeedbackState";
import useLang from "@/context/useLang";
import { IconSettings } from "@tabler/icons-react";

const SettingsRoute = () => {
  // Contexts
  const { l } = useLang();

  return (
    <CContainer flex={1} align={"center"} justify={"center"} p={4}>
      <FeedbackState
        icon={<IconSettings stroke={1.8} />}
        title={l.settings}
        description={l.msg_settings_index_route}
      />
    </CContainer>
  );
};
export default SettingsRoute;
