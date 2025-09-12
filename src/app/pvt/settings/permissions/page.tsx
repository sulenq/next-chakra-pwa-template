"use client";

import { CContainer } from "@/components/ui/c-container";
import { HelperText } from "@/components/ui/helper-text";
import useLang from "@/context/useLang";

const SettingsDisplayRoute = () => {
  // Contexts
  const { l } = useLang();
  return (
    <CContainer>
      <CContainer p={4}>
        <HelperText>{l.msg_settings_saved_locally}</HelperText>
      </CContainer>
    </CContainer>
  );
};
export default SettingsDisplayRoute;
