"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { useLocale } from "@/contexts/useLocale";

export const LocalSettingsHelperText = () => {
  // Contexts
  const { t } = useLocale();

  return (
    <CContainer flex={1} p={4}>
      <HelperText>{t.msg_settings_saved_locally}</HelperText>
    </CContainer>
  );
};
