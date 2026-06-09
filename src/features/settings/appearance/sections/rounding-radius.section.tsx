"use client";

import { Item } from "@/components/container/item";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH, StackV } from "@/components/ui/stack";
import { SettingsGroupTitle } from "@/components/ui/typography";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { R_SPACING_MD } from "@/constants/styles";
import { PSleleton } from "@/features/settings/appearance/sections/color-mode.section";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { Box, Circle, SimpleGrid } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const RoundedSection = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme, setTheme } = useThemeStore();

  // Utils
  function handleOnClick(preset: (typeof ROUNDED_PRESETS)[number]) {
    setTheme((state) => ({
      ...state,
      radii: {
        label: preset.label,
        component: preset.component,
        container: preset.container,
      },
    }));
  }

  return (
    <StackV px={R_SPACING_MD}>
      <SettingsGroupTitle>
        {t.settings_rounded_section.title}
      </SettingsGroupTitle>

      <Item.Body p={2} gap={4}>
        <SimpleGrid minChildWidth={"160px"} gapX={1} gapY={4}>
          {ROUNDED_PRESETS.map((preset, index) => {
            const isSelected = preset.label === theme.radii.label;

            return (
              <StackV
                key={`${preset.label}-${index}`}
                gap={2}
                p={R_SPACING_MD}
                rounded={theme.radii.component}
                cursor={"pointer"}
                transition={"200ms"}
                _hover={{
                  bg: "bg.muted",
                }}
                onClick={() => {
                  handleOnClick(preset);
                }}
              >
                <StackV
                  gap={2}
                  aspectRatio={3 / 4}
                  p={2}
                  rounded={preset.container}
                  border={"1px solid"}
                  borderColor={"border.emphasized"}
                  pos={"relative"}
                >
                  <StackH align={"center"} gap={2} pl={1}>
                    <PSleleton w={"40%"} />

                    <Circle
                      w={"24px"}
                      h={"24px"}
                      bg={"d1"}
                      border={"1px solid"}
                      borderColor={"border.muted"}
                      ml={"auto"}
                    />
                  </StackH>

                  <Box
                    flex={1}
                    rounded={preset.component}
                    border={"1px solid"}
                    borderColor={"border.muted"}
                    bg={"d1"}
                  />

                  <StackH gap={2} justify={"end"}>
                    <Box
                      w={"30%"}
                      h={"30px"}
                      rounded={preset.component}
                      border={"1px solid"}
                      borderColor={"border.muted"}
                      bg={"d1"}
                    />

                    <Box
                      w={"30%"}
                      h={"30px"}
                      rounded={preset.component}
                      border={"1px solid"}
                      borderColor={"border.muted"}
                      bg={"d1"}
                    />
                  </StackH>
                </StackV>

                <StackV align={"center"} gap={2}>
                  <P textAlign={"center"}>{preset.label}</P>

                  <RadioItem checked={isSelected} />
                </StackV>
              </StackV>
            );
          })}
        </SimpleGrid>

        <StackV px={2} pb={2}>
          <P color={"fg.subtle"}>{t.settings_rounded_section.description}</P>
        </StackV>
      </Item.Body>

      {/* <SettingsHelperText>{t.settings_rounded_section.helper}</SettingsHelperText> */}
    </StackV>
  );
};
