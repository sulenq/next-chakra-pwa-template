import { GroupItem } from "@/components/container/group-item";
import { Item } from "@/components/container/item";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import {
  SettingsGroupTitle,
  SettingsHelperText,
} from "@/components/ui/typography";
import { LANGUAGES } from "@/constants/languages";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { SelectLanguage } from "../components/select.language";

// -----------------------------------------------------------------

const LanguageSelectSetting = () => {
  // Store
  const { t } = useLocaleStore();
  const { locale, setLocale } = useLocaleStore();

  return (
    <StackV>
      <GroupItem.Root>
        <StackV gap={1}>
          <P>{t.settings_locale_section.title}</P>

          <P color={"fg.subtle"}>{t.settings_locale_section.description}</P>
        </StackV>

        <GroupItem.Target>
          <SelectLanguage
            id={"select-language"}
            value={[
              {
                id: locale,
                label: LANGUAGES.find((l) => l.key === locale)?.label!,
              },
            ]}
            onChange={(v) => {
              if (v?.[0]) setLocale(v[0].id);
            }}
            w={"fit"}
            p={0}
            variant={"plain"}
            size={"xs"}
            color={"fg.subtle"}
          />
        </GroupItem.Target>
      </GroupItem.Root>
    </StackV>
  );
};
export const LanguageSection = () => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <Item.Root px={R_SPACING_MD}>
      <SettingsGroupTitle>{t.language}</SettingsGroupTitle>

      <Item.Body gap={4}>
        <LanguageSelectSetting />
      </Item.Body>

      <SettingsHelperText>
        {t.settings_locale_section.helper}
      </SettingsHelperText>
    </Item.Root>
  );
};
