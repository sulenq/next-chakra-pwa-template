"use client";

import { Item } from "@/components/container/item";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { Divider } from "@/components/ui/divider";
import { SettingsHelperText } from "@/components/ui/helper-text";
import { NumInput } from "@/components/ui/number-input";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useConstrainedContainerStore } from "../stores/use-constrained-container-store";
import { useDebounced } from "@/hooks/use-debounced";

// -----------------------------------------------------------------

const ActiveSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { constrainedContainer, setConstrainedContainer } =
    useConstrainedContainerStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_constrained_container_active.title}</P>

        <P color={"fg.subtle"}>
          {t.settings_constrained_container_active.description}
        </P>
      </StackV>

      <Switch
        checked={constrainedContainer.isActive}
        onCheckedChange={(e) => {
          setConstrainedContainer({
            isActive: e.checked,
          });
        }}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const MaxWSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { constrainedContainer, setConstrainedContainer } =
    useConstrainedContainerStore();

  // Hooks
  const debouncedMaxW = useDebounced((value: string) => {
    setConstrainedContainer({
      maxW: value,
    });
  }, 400);

  return (
    <SettingItemContainer disabled={!constrainedContainer.isActive}>
      <StackV gap={1}>
        <P>{`${t.settings_constrained_container_max_w.title} (px)`}</P>

        <P color={"fg.subtle"}>
          {t.settings_constrained_container_max_w.description}
        </P>
      </StackV>

      <NumInput
        inputValue={parseInt(constrainedContainer.maxW)}
        onChange={(inputValue) => {
          if (inputValue) debouncedMaxW(`${inputValue}px`);
        }}
        min={720}
        placeholder={""}
        w={"120px"}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

export const ConstrainedContainerSection = () => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <StackV px={R_SPACING_MD}>
      <SettingsHelperText>
        {t.settings_constrained_container_section.title}
      </SettingsHelperText>

      <Item.Body>
        <ActiveSetting />

        <Divider mx={4}></Divider>

        <MaxWSetting />
      </Item.Body>
    </StackV>
  );
};
