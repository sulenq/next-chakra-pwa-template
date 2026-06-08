import { HScroll } from "@/components/container/h-scroll";
import { Item } from "@/components/container/item";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { Divider } from "@/components/ui/divider";
import { SettingsGroupTitle } from "@/components/ui/typography";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { COLOR_PALETTES } from "@/constants/colors";
import { R_SPACING_MD } from "@/constants/styles";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { Box, Center } from "@chakra-ui/react";

// -----------------------------------------------------------------

const AccentColorSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <StackV>
      <HScroll>
        <Box w={"max"} p={4}>
          <StackH rounded={theme.radii.component} overflow={"clip"}>
            {COLOR_PALETTES.map((color, index) => {
              const isSelected = color.palette === theme.colorPalette;
              const isColorPaletteGray = color.palette === "gray";

              return (
                <Tooltip
                  key={`${color.palette}-${index}`}
                  content={color.label}
                >
                  <Center
                    minW={"40px"}
                    aspectRatio={1}
                    p={2}
                    bg={isColorPaletteGray ? "ibody" : `${color.palette}.500`}
                    cursor={"pointer"}
                    overflow={"clip"}
                    onClick={() => {
                      setTheme({
                        colorPalette: color.palette,
                        primaryColor: isColorPaletteGray
                          ? "ibody"
                          : `${color.palette}.500`,
                        primaryColorHex: color.primaryHex,
                      });
                    }}
                    pos={"relative"}
                  >
                    {isSelected && (
                      <RadioItem
                        checked={true}
                        bg={"transparent"}
                        borderColor={isColorPaletteGray ? "bg.body" : "light"}
                      />
                    )}
                  </Center>
                </Tooltip>
              );
            })}
          </StackH>
        </Box>
      </HScroll>

      <StackV px={4} pb={4}>
        <P color={"fg.subtle"}>{t.settings_accent_color_section.description}</P>
      </StackV>
    </StackV>
  );
};

// -----------------------------------------------------------------

const AmbienceColorSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { theme, setTheme } = useThemeStore();

  return (
    <SettingItemContainer>
      <StackV gap={1}>
        <P>{t.settings_ambience_color.title}</P>

        <P color={"fg.subtle"}>{t.settings_ambience_color.description}</P>
      </StackV>

      <Switch
        checked={theme.ambienceColor}
        onCheckedChange={(e) => {
          setTheme({
            ambienceColor: e.checked,
          });
        }}
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

export const AccentColorSection = () => {
  // Stores
  const { t } = useLocaleStore();

  return (
    <StackV px={R_SPACING_MD}>
      <SettingsGroupTitle>
        {t.settings_accent_color_section.title}
      </SettingsGroupTitle>

      <Item.Body>
        <AccentColorSetting />

        <Divider />

        <AmbienceColorSetting />
      </Item.Body>
    </StackV>
  );
};
