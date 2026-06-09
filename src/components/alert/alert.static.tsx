import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/views/regional/stores/use-locale-store";
import { InfoIcon } from "lucide-react";
import { AppIconLucide } from "../branding/app-icon";
import { P } from "../ui/p";
import { StackH } from "../ui/stack";
import { R_SPACING_MD } from "@/constants/styles";

export const SettingsSavedLocalyAlert = () => {
  // Store
  const { t } = useLocaleStore();
  const { theme } = useThemeStore();

  return (
    <StackH
      p={4}
      gap={2}
      bg={"bg.body"}
      rounded={theme.radii.container}
      color={"fg.subtle"}
      mx={R_SPACING_MD}
    >
      <AppIconLucide icon={InfoIcon} mt={"2px"} />

      <P>{t.msg_settings_saved_locally}</P>
    </StackH>
  );
};
