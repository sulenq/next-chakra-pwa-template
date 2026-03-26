"use client";

import { Btn } from "@/components/ui/btn";
import { Checkbox } from "@/components/ui/checkbox";
import { useColorMode } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { P } from "@/components/ui/p";
import { SelectInput } from "@/components/ui/select-input";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { Item } from "@/components/widgets/item";
import { LocalSettingsHelperText } from "@/components/widgets/local-settings-helper-text";
import { ToggleSettingContainer } from "@/components/widgets/settings-shell";
import { COLOR_PALETTES } from "@/constants/colors";
import { Interface__SelectOption } from "@/constants/interfaces";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import { R_SPACING_MD } from "@/constants/styles";
import useADM from "@/contexts/useADM";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { formatTime } from "@/utils/formatter";
import { interpolateString } from "@/utils/string";
import { Box, Center, Circle, HStack, SimpleGrid } from "@chakra-ui/react";
import {
  EclipseIcon,
  LayoutPanelLeftIcon,
  SquareRoundCornerIcon,
  SwatchBookIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ManualDarkModeSetting = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { t } = useLocale();
  const { colorMode, setColorMode } = useColorMode();
  const { ADM } = useADM();

  // States, Refs
  const timeoutRef = useRef<any>(null);
  const [active, setActive] = useState(colorMode === "dark");

  // Handle active state
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setColorMode(active ? "dark" : "light");
      timeoutRef.current = null;
    }, 100);
  }, [active]);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActive(colorMode === "dark" ? true : false);
      timeoutRef.current = null;
    }, 100);
  }, [colorMode]);

  return (
    <ToggleSettingContainer disabled={ADM}>
      <StackV gap={1}>
        <P>{t.settings_dark_mode.title}</P>
        <P color={"fg.subtle"}>{t.settings_dark_mode.description}</P>
      </StackV>

      <Switch
        checked={active}
        onCheckedChange={(e) => {
          setActive(e.checked);
        }}
        colorPalette={themeConfig.colorPalette}
      />
    </ToggleSettingContainer>
  );
};

const ADMSetting = () => {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const { t } = useLocale();
  const { ADM, setADM } = useADM();

  // States, Refs
  const [active, setActive] = useState(ADM);
  const timeoutRef = useRef<any>(null);

  // Handle active state
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setADM(active);
      timeoutRef.current = null;
    }, 100);
  }, [active]);

  return (
    <ToggleSettingContainer>
      <StackV gap={1}>
        <P>{t.settings_adaptive_dark_mode.title}</P>

        <P color={"fg.subtle"}>
          {interpolateString(t.settings_adaptive_dark_mode.description, {
            timeRange: `${formatTime("18:00")} - ${formatTime("06:00")}`,
          })}
        </P>
      </StackV>

      <Switch
        checked={active}
        onChange={() => {
          setActive(!active);
        }}
        colorPalette={themeConfig.colorPalette}
      />
    </ToggleSettingContainer>
  );
};

const DarkModeSection = () => {
  // Contexts
  const { t } = useLocale();
  const { colorMode, setColorMode } = useColorMode();

  // States, Refs
  const timeoutRef = useRef<any>(null);
  const [active, setActive] = useState(colorMode === "dark");

  // Handle active state
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setColorMode(active ? "dark" : "light");
      timeoutRef.current = null;
    }, 100);
  }, [active]);
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setActive(colorMode === "dark" ? true : false);
      timeoutRef.current = null;
    }, 100);
  }, [colorMode]);

  return (
    <Item.Container bg={"transparent"}>
      <Item.Header borderless>
        <StackH align={"center"} gap={2}>
          <AppIconLucide icon={EclipseIcon} />

          <Item.Title>{t.dark_mode}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Container gap={4} p={4}>
          <ManualDarkModeSetting />

          <ADMSetting />
        </Item.Container>
      </StackV>
    </Item.Container>
  );
};

const AccentColorSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  return (
    <Item.Container bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={SwatchBookIcon} />

          <Item.Title>{t.accent_color}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Container p={4}>
          <SimpleGrid minChildWidth={"56px"} gap={2}>
            {COLOR_PALETTES.map((color, index) => {
              const isSelected = color.palette === themeConfig.colorPalette;
              const isColorPaletteGray = color.palette === "gray";

              return (
                <Tooltip
                  key={`${color.palette}-${index}`}
                  content={color.label}
                >
                  <Center
                    w={"full"}
                    aspectRatio={1}
                    p={2}
                    bg={isColorPaletteGray ? "ibody" : `${color.palette}.500`}
                    rounded={themeConfig.radii.component}
                    cursor={"pointer"}
                    overflow={"clip"}
                    onClick={() => {
                      setThemeConfig({
                        colorPalette: color.palette,
                        primaryColor: isColorPaletteGray
                          ? "ibody"
                          : `${color.palette}.500`,
                        primaryColorHex: color.primaryHex,
                      });
                    }}
                    pos={"relative"}
                  >
                    {/* <P
                    fontSize={"sm"}
                    fontWeight={"medium"}
                    color={`${color.palette}.contrast`}
                    textAlign={"center"}
                    lineClamp={1}
                  >
                    {color.label}
                  </P> */}

                    {isSelected && (
                      <DotIndicator
                        pos={"absolute"}
                        bg={isColorPaletteGray ? "bg.body" : "light"}
                        top={2}
                        right={2}
                      />
                    )}
                  </Center>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </Item.Container>
      </StackV>
    </Item.Container>
  );
};

const RoundedSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  // Utils
  function handleOnClick(preset: (typeof ROUNDED_PRESETS)[number]) {
    setThemeConfig((state) => ({
      ...state,
      radii: {
        label: preset.label,
        component: preset.component,
        container: preset.container,
      },
    }));
  }

  return (
    <Item.Container bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={SquareRoundCornerIcon} />

          <Item.Title>{t.rounded}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Container p={4}>
          <SimpleGrid minChildWidth={"140px"} gap={4}>
            {ROUNDED_PRESETS.map((preset, index) => {
              const isSelected = preset.label === themeConfig.radii.label;

              return (
                <StackV key={`${preset.label}-${index}`}>
                  <StackV
                    gap={2}
                    aspectRatio={1}
                    p={2}
                    rounded={preset.container}
                    border={"1px solid"}
                    borderColor={"border.emphasized"}
                    cursor={"pointer"}
                    onClick={() => {
                      handleOnClick(preset);
                    }}
                    pos={"relative"}
                  >
                    <HStack pl={1}>
                      <P>{preset.label}</P>

                      {isSelected && <DotIndicator />}

                      <Circle
                        w={"24px"}
                        h={"24px"}
                        bg={"d1"}
                        border={"1px solid"}
                        borderColor={"border.muted"}
                        ml={"auto"}
                      />
                    </HStack>

                    <Box
                      flex={1}
                      rounded={preset.component}
                      border={"1px solid"}
                      borderColor={"border.muted"}
                      bg={"d1"}
                    />

                    <HStack justify={"end"}>
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
                    </HStack>
                  </StackV>
                </StackV>
              );
            })}
          </SimpleGrid>
        </Item.Container>
      </StackV>
    </Item.Container>
  );
};

const ExampleUISection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // States
  const [checked, setChecked] = useState<boolean>(true);
  const [select, setSelect] = useState<
    Interface__SelectOption[] | null | undefined
  >(null);

  return (
    <Item.Container bg={"transparent"}>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={LayoutPanelLeftIcon} />

          <Item.Title>{t.example_UI}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Container p={4}>
          <HStack wrap={"wrap"} gapY={4}>
            <Btn flex={"1 1 100px"} colorPalette={themeConfig.colorPalette}>
              Label
            </Btn>

            <Btn
              flex={"1 1 100px"}
              colorPalette={themeConfig.colorPalette}
              variant={"outline"}
            >
              Label
            </Btn>

            <Btn
              flex={"1 1 100px"}
              colorPalette={themeConfig.colorPalette}
              variant={"subtle"}
            >
              Label
            </Btn>

            <StringInput flex={"1 1 200px"} placeholder="example@email.com" />

            <SelectInput
              id="example-select-religion"
              flex={"1 1 200px"}
              name="select1"
              selectOptions={OPTIONS_RELIGION}
              onChange={(inputValue) => {
                setSelect(inputValue);
              }}
              inputValue={select}
              multiple
            />

            <DatePickerInput flex={"1 1 200px"} multiple />

            <TimePickerInput flex={"1 1 200px"} />

            <Checkbox
              checked={checked}
              onChange={(e: any) => setChecked(!e.target.checked)}
              colorPalette={themeConfig.colorPalette}
              variant={"solid"}
              size={"lg"}
            ></Checkbox>

            <Switch colorPalette={themeConfig.colorPalette} />
          </HStack>
        </Item.Container>
      </StackV>
    </Item.Container>
  );
};

export default function Page() {
  return (
    <StackV flex={1} gap={2}>
      <DarkModeSection />

      <AccentColorSection />

      <RoundedSection />

      <ExampleUISection />

      <LocalSettingsHelperText />
    </StackV>
  );
}
