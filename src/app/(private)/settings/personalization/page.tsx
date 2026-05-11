"use client";

import { Btn } from "@/components/ui/btn";
import { Checkbox } from "@/components/ui/checkbox";
import { useColorMode } from "@/components/ui/color-mode";
import { DateTimePickerInput } from "@/components/ui/date-time-picker-input";
import { P } from "@/components/ui/p";
import { SelectInput } from "@/components/ui/select-input";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { Item } from "@/components/widgets/item";
import { SettingsSavedLocalyHelperText } from "@/components/widgets/local-settings-helper-text";
import { ToggleSettingContainer } from "@/components/widgets/settings-shell";
import { COLOR_PALETTES } from "@/constants/colors";
import { SelectOption } from "@/types/global.types";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { OPTIONS_RELIGION } from "@/constants/select-options";
import { R_SPACING_MD } from "@/constants/styles";
import useADM from "@/contexts/use-adm-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
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

// -----------------------------------------------------------------

const ManualDarkModeSetting = () => {
  // Contexts
  const { themeContext } = useThemeContext();
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
        colorPalette={themeContext.colorPalette}
      />
    </ToggleSettingContainer>
  );
};

// -----------------------------------------------------------------

const ADMSetting = () => {
  // Contexts
  const { themeContext } = useThemeContext();
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
        colorPalette={themeContext.colorPalette}
      />
    </ToggleSettingContainer>
  );
};

// -----------------------------------------------------------------

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
    <Item.Root>
      <Item.Header borderless>
        <StackH align={"center"} gap={2}>
          <AppIconLucide icon={EclipseIcon} />

          <Item.Title>{t.dark_mode}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body gap={4} p={4}>
          <ManualDarkModeSetting />

          <ADMSetting />
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const AccentColorSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext, setThemeContext } = useThemeContext();

  return (
    <Item.Root>
      <Item.Header borderless>
        <StackH align={"center"}>
          <AppIconLucide icon={SwatchBookIcon} />

          <Item.Title>{t.accent_color}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <SimpleGrid minChildWidth={"56px"} gap={2}>
            {COLOR_PALETTES.map((color, index) => {
              const isSelected = color.palette === themeContext.colorPalette;
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
                    rounded={themeContext.radii.component}
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
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const RoundedSection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext, setThemeContext } = useThemeContext();

  // Utils
  function handleOnClick(preset: (typeof ROUNDED_PRESETS)[number]) {
    setThemeContext((state) => ({
      ...state,
      radii: {
        label: preset.label,
        component: preset.component,
        container: preset.container,
      },
    }));
  }

  return (
    <Item.Root>
      <Item.Header borderless>
        <StackH align={"center"}>
          <AppIconLucide icon={SquareRoundCornerIcon} />

          <Item.Title>{t.rounded}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <SimpleGrid minChildWidth={"140px"} gap={4}>
            {ROUNDED_PRESETS.map((preset, index) => {
              const isSelected = preset.label === themeContext.radii.label;

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
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const ExampleUISection = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext } = useThemeContext();

  // States
  const [checked, setChecked] = useState<boolean>(true);
  const [select, setSelect] = useState<SelectOption[] | null | undefined>(null);

  return (
    <Item.Root>
      <Item.Header borderless>
        <HStack>
          <AppIconLucide icon={LayoutPanelLeftIcon} />

          <Item.Title>{t.example_UI}</Item.Title>
        </HStack>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body p={4}>
          <StackH wrap={"wrap"} gap={3}>
            <StackV flex={"1 0 200px"} columns={2} gap={3}>
              <Btn colorPalette={themeContext.colorPalette}>Label</Btn>

              <Btn colorPalette={themeContext.colorPalette} variant={"subtle"}>
                Label
              </Btn>

              <Btn colorPalette={themeContext.colorPalette} variant={"outline"}>
                Label
              </Btn>

              <Btn colorPalette={themeContext.colorPalette} variant={"ghost"}>
                Label
              </Btn>
            </StackV>

            <StackV flex={"1 0 200px"} columns={2} gap={3}>
              <StringInput placeholder={"example@email.com"} />

              <SelectInput
                id={"example-select-religion"}
                name={"select1"}
                selectOptions={OPTIONS_RELIGION}
                onChange={(inputValue) => {
                  setSelect(inputValue);
                }}
                inputValue={select}
                multiple
              />

              <DateTimePickerInput />

              <StackH gap={4}>
                <StackV justify={"center"} minH={"36px"}>
                  <Checkbox
                    checked={checked}
                    onChange={(e: any) => setChecked(!e.target.checked)}
                    colorPalette={themeContext.colorPalette}
                    variant={"solid"}
                    size={"lg"}
                  >
                    Checkbox
                  </Checkbox>
                </StackV>

                <StackV justify={"center"} minH={"36px"}>
                  <Switch colorPalette={themeContext.colorPalette}>
                    Switch
                  </Switch>
                </StackV>
              </StackH>
            </StackV>
          </StackH>
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={2}>
      <DarkModeSection />

      <AccentColorSection />

      <RoundedSection />

      <ExampleUISection />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
