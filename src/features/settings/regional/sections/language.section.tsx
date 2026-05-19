import { Btn } from "@/components/ui/btn";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH } from "@/components/ui/stack";
import { Item } from "@/components/widgets/item";
import { LANGUAGES } from "@/constants/languages";
import { COMMON_NAV_COLOR, R_SPACING_MD } from "@/constants/styles";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import { type LocaleOption } from "@/types/global.types";
import { chakra, Text } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const LanguageSection = () => {
  // Contexts
  const { themeContext } = useThemeContext();
  const { t, locale, setLocale } = useLocale();

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsHelperText>{t.settings_locale_section.title}</SettingsHelperText>

      <Item.Body p={4} gap={4}>
        <StackH align={"center"} wrap={"wrap"} gap={2}>
          {LANGUAGES.map((item, i) => {
            const isSelected = locale === item.key;

            return (
              <Btn
                key={i}
                clicky={false}
                flex={"1 1 180px"}
                gap={3}
                px={3}
                rounded={themeContext.radii.component}
                variant={"ghost"}
                justifyContent={"start"}
                color={isSelected ? "" : COMMON_NAV_COLOR}
                onClick={() => {
                  setLocale(item.key as LocaleOption);
                }}
                pos={"relative"}
              >
                <RadioItem checked={isSelected} />

                <Text fontWeight={"medium"} truncate>
                  {item.label}

                  <chakra.span color={"fg.subtle"} ml={2} fontWeight={"normal"}>
                    {item.code}
                  </chakra.span>
                </Text>
              </Btn>
            );
          })}
        </StackH>

        <P color={"fg.subtle"}>{t.settings_locale_section.description}</P>
      </Item.Body>

      <SettingsHelperText>
        {t.settings_locale_section.helper}
      </SettingsHelperText>
    </Item.Root>
  );
};
