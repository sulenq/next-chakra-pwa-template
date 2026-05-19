import { SettingsHelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH, StackV } from "@/components/ui/stack";
import { Tooltip } from "@/components/ui/tooltip";
import { HScroll } from "@/components/container/h-scroll";
import { Item } from "@/components/container/item";
import { COLOR_PALETTES } from "@/constants/colors";
import { R_SPACING_MD } from "@/constants/styles";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { Box, Center } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const AccentColorSection = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { themeContext, setThemeContext } = useThemeContext();

  return (
    <StackV px={R_SPACING_MD}>
      <SettingsHelperText>
        {t.settings_accent_color_section.title}
      </SettingsHelperText>

      <Item.Body>
        <HScroll>
          <Box w={"max"} p={4}>
            <StackH rounded={themeContext.radii.component} overflow={"clip"}>
              {COLOR_PALETTES.map((color, index) => {
                const isSelected = color.palette === themeContext.colorPalette;
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
                        setThemeContext({
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
          <P color={"fg.subtle"}>
            {t.settings_accent_color_section.description}
          </P>
        </StackV>
      </Item.Body>
    </StackV>
  );
};
