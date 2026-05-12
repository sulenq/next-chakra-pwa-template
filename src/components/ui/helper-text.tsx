import { P, PProps } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const HelperText = (props: PProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <P fontSize={"sm"} color={"fg.subtle"} lineHeight={1.2} {...restProps}>
      {children}
    </P>
  );
};

// -----------------------------------------------------------------

export const SettingsHelperText = (props: StackProps) => {
  // Props
  const { children, ...restProps } = props;

  return (
    <StackV flex={1} px={4} py={R_SPACING_MD} {...restProps}>
      <HelperText>{children}</HelperText>
    </StackV>
  );
};

// -----------------------------------------------------------------

export const SettingsSavedLocalyHelperText = () => {
  // Contexts
  const { t } = useLocale();

  return (
    <SettingsHelperText>
      <HelperText>{t.msg_settings_saved_locally}</HelperText>
    </SettingsHelperText>
  );
};
