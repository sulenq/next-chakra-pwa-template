"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { useColorMode } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { P } from "@/components/ui/p";
import { SelectInput } from "@/components/ui/select-input";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIcon } from "@/components/widgets/app-icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { Item } from "@/components/widgets/item";
import { LocalSettingsHelperText } from "@/components/widgets/local-settings-helper-text";
import { ToggleSettingContainer } from "@/components/widgets/settings-shell";
import { COLOR_PALETTES } from "@/constants/colors";
import { Interface__SelectOption } from "@/constants/interfaces";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
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
      <CContainer gap={1}>
        <P>{t.settings_dark_mode.title}</P>
        <P color={"fg.subtle"}>{t.settings_dark_mode.description}</P>
      </CContainer>

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
      <CContainer gap={1}>
        <P>{t.settings_adaptive_dark_mode.title}</P>

        <P color={"fg.subtle"}>
          {interpolateString(t.settings_adaptive_dark_mode.description, {
            timeRange: `${formatTime("18:00")} - ${formatTime("06:00")}`,
          })}
        </P>
      </CContainer>

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
    <CContainer>
      <Item.HeaderContainer borderless>
        <HStack>
          <AppIcon icon={EclipseIcon} />

          <Item.HeaderTitle>{t.dark_mode}</Item.HeaderTitle>
        </HStack>
      </Item.HeaderContainer>

      <CContainer px={4}>
        <Item.Container gap={4} p={4}>
          <ManualDarkModeSetting />

          <ADMSetting />
        </Item.Container>
      </CContainer>
    </CContainer>
  );
};

const AccentColorSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <CContainer ref={containerRef}>
      <Item.HeaderContainer borderless>
        <HStack>
          <AppIcon icon={SwatchBookIcon} />

          <Item.HeaderTitle>{t.accent_color}</Item.HeaderTitle>
        </HStack>
      </Item.HeaderContainer>

      <CContainer px={4}>
        <Item.Container gap={4} p={4}>
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
                        color={isColorPaletteGray ? "bg.body" : "light"}
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
      </CContainer>
    </CContainer>
  );
};

const RoundedSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

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
    <CContainer ref={containerRef}>
      <Item.HeaderContainer borderless>
        <HStack>
          <AppIcon icon={SquareRoundCornerIcon} />

          <Item.HeaderTitle>{t.rounded}</Item.HeaderTitle>
        </HStack>
      </Item.HeaderContainer>

      <CContainer px={4}>
        <Item.Container gap={4} p={4}>
          <SimpleGrid minChildWidth={"140px"} gap={4}>
            {ROUNDED_PRESETS.map((preset, index) => {
              const isSelected = preset.label === themeConfig.radii.label;

              return (
                <CContainer key={`${preset.label}-${index}`}>
                  <CContainer
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
                  </CContainer>
                </CContainer>
              );
            })}
          </SimpleGrid>
        </Item.Container>
      </CContainer>
    </CContainer>
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
    <CContainer>
      <Item.HeaderContainer borderless>
        <HStack>
          <AppIcon icon={LayoutPanelLeftIcon} />

          <Item.HeaderTitle>{t.example_UI}</Item.HeaderTitle>
        </HStack>
      </Item.HeaderContainer>

      <CContainer px={4}>
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
      </CContainer>
    </CContainer>
  );
};

export default function Page() {
  return (
    <CContainer flex={1} gap={3}>
      <DarkModeSection />

      <AccentColorSection />

      <RoundedSection />

      <ExampleUISection />

      <LocalSettingsHelperText />
    </CContainer>
  );
}
