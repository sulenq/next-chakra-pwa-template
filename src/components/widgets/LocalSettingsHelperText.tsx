"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import useLang from "@/contexts/useLang";

export const LocalSettingsHelperText = () => {
  // Contexts
  const { t } = useLang();

  return (
    <CContainer flex={1} p={4} bg={"body"}>
      <HelperText>{t.msg_settings_saved_locally}</HelperText>
    </CContainer>
  );
};
