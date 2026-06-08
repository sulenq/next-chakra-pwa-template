"use client";

import { Item } from "@/components/container/item";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { Divider } from "@/components/ui/divider";
import { NumInput } from "@/components/ui/num-input";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { SettingsGroupTitle } from "@/components/ui/typography";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useDebounced } from "@/hooks/use-debounced";
import { useConstrainedContainerStore } from "../stores/use-constrained-container-store";

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
        defaultValue={parseInt(constrainedContainer.maxW)}
        onChange={(value) => {
          if (value) debouncedMaxW(`${value}px`);
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
      <SettingsGroupTitle>
        {t.settings_constrained_container_section.title}
      </SettingsGroupTitle>

      <Item.Body>
        <ActiveSetting />

        <Divider />

        <MaxWSetting />
      </Item.Body>
    </StackV>
  );
};
