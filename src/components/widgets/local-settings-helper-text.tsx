"use client";

import { HelperText } from "@/components/ui/helper-text";
import { StackV } from "@/components/ui/stack";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";

// -----------------------------------------------------------------

export const SettingsSavedLocalyHelperText = () => {
  // Contexts
  const { t } = useLocale();

  return (
    <StackV flex={1} px={4} py={R_SPACING_MD}>
      <HelperText>{t.msg_settings_saved_locally}</HelperText>
    </StackV>
  );
};
