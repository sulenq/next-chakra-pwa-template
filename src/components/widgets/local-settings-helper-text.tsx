"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import { R_SPACING_MD } from "@/shared/constants/styles";
import { useLocale } from "@/contexts/useLocale";

// -----------------------------------------------------------------

export const LocalSettingsHelperText = () => {
  // Contexts
  const { t } = useLocale();

  return (
    <CContainer flex={1} p={R_SPACING_MD}>
      <HelperText>{t.msg_settings_saved_locally}</HelperText>
    </CContainer>
  );
};
