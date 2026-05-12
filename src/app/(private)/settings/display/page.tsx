"use client";

import { Btn } from "@/components/ui/btn";
import { Checkbox } from "@/components/ui/checkbox";
import { useColorMode } from "@/components/ui/color-mode";
import { DateTimePickerInput } from "@/components/ui/date-time-picker-input";
import { Divider } from "@/components/ui/divider";
import {
  SettingsHelperText,
  SettingsSavedLocalyHelperText,
} from "@/components/ui/helper-text";
import { Img } from "@/components/ui/img";
import { P } from "@/components/ui/p";
import { SelectInput } from "@/components/ui/select-input";
import { StackH, StackV } from "@/components/ui/stack";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { DotIndicator } from "@/components/widgets/indicator";
import { Item } from "@/components/widgets/item";
import { ToggleSettingContainer } from "@/components/widgets/settings-shell";
import { COLOR_PALETTES } from "@/constants/colors";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { OPTIONS_RELIGION } from "@/constants/select-options";
import { R_SPACING_MD, SECTION_GAP } from "@/constants/styles";
import useADM from "@/contexts/use-adm-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import { SelectOption } from "@/types/global.types";
import { formatTime } from "@/utils/formatter";
import { interpolateString } from "@/utils/string";
import { Box, BoxProps, Center, Circle, SimpleGrid } from "@chakra-ui/react";
import { BrushIcon, EclipseIcon } from "lucide-react";
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
        onCheckedChange={(e) => {
          setActive(e.checked);
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
      <Item.Header borderless color={"fg.muted"}>
        <StackH align={"center"} gap={2}>
          <AppIconLucide icon={EclipseIcon} />

          <Item.Title>{t.dark_mode}</Item.Title>
        </StackH>
      </Item.Header>

      <StackV px={R_SPACING_MD} pb={R_SPACING_MD}>
        <Item.Body gap={4} p={4}>
          <ManualDarkModeSetting />

          <Divider />

          <ADMSetting />
        </Item.Body>
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

const SkeletonP = (props: BoxProps) => {
  return (
    <Box h={"16px"} w={"full"} bg={"bg.muted"} rounded={"full"} {...props} />
  );
};

const ExampleUI = () => {
  // Contexts
  const { themeContext } = useThemeContext();

  // States
  const [checked, setChecked] = useState<boolean>(true);
  const [checked2, setChecked2] = useState<boolean>(true);
  const [select, setSelect] = useState<SelectOption[] | null | undefined>(null);

  console.debug(checked2);

  return (
    <StackV px={R_SPACING_MD}>
      <Item.Body p={4}>
        <StackH wrap={"wrap"} gap={6}>
          <StackV w={"170px"} gap={6}>
            <StackV
              gap={2}
              rounded={themeContext.radii.component}
              border={"1px solid"}
              borderColor={"border.muted"}
            >
              <Center aspectRatio={1} w={"full"} p={1}>
                <Img
                  w={"full"}
                  rounded={`calc(${themeContext.radii.component} - 4px)`}
                />
              </Center>

              <StackV gap={2} px={3}>
                <SkeletonP w={"70%"} />
                <SkeletonP />
              </StackV>

              <StackV p={2}>
                <Btn colorPalette={themeContext.colorPalette} variant={"ghost"}>
                  <SkeletonP w={"70%"} bg={`${themeContext.colorPalette}.fg`} />
                </Btn>
              </StackV>
            </StackV>

            <StackV gap={4}>
              <StackV justify={"center"} minH={"36px"}>
                <Checkbox
                  checked={checked}
                  onCheckedChange={(e: any) => setChecked(e.checked)}
                  alignItems={"start"}
                  colorPalette={themeContext.colorPalette}
                  variant={"solid"}
                  size={"lg"}
                >
                  <StackV gap={2}>
                    <SkeletonP w={"100px"} />
                    <SkeletonP w={"120px"} />
                  </StackV>
                </Checkbox>
              </StackV>
            </StackV>
          </StackV>

          <StackV flex={4} gap={SECTION_GAP}>
            <StackV gap={2}>
              <SkeletonP w={"100px"} />

              <StringInput placeholder={""} />
            </StackV>

            <StackV gap={2}>
              <SkeletonP w={"150px"} />

              <SelectInput
                id={"example-select-religion"}
                name={"select1"}
                placeholder={""}
                selectOptions={OPTIONS_RELIGION}
                onChange={(inputValue) => {
                  setSelect(inputValue);
                }}
                inputValue={select}
                multiple
              />
            </StackV>

            <StackV gap={2}>
              <SkeletonP w={"120px"} />

              <StackV>
                <DateTimePickerInput
                  placeholder={{
                    date: "",
                    time: "",
                  }}
                />
              </StackV>
            </StackV>

            <StackV justify={"center"} minH={"36px"}>
              <Switch
                checked={checked2}
                onCheckedChange={(e) => setChecked2(e.checked)}
                colorPalette={themeContext.colorPalette}
              >
                <SkeletonP w={"100px"} />
              </Switch>
            </StackV>

            <Divider my={2} />

            <StackH justify={"end"} gap={2}>
              <Btn w={"80px"} variant={"outline"}>
                <SkeletonP w={"70%"} />
              </Btn>

              <Btn
                w={"100px"}
                colorPalette={themeContext.colorPalette}
                variant={"solid"}
              >
                <SkeletonP
                  w={"70%"}
                  bg={`${themeContext.colorPalette}.contrast`}
                />
              </Btn>
            </StackH>
          </StackV>
        </StackH>
      </Item.Body>
    </StackV>
  );
};

// -----------------------------------------------------------------

const AccentColorSetting = () => {
  // Contexts
  const { t } = useLocale();
  const { themeContext, setThemeContext } = useThemeContext();

  return (
    <StackV px={R_SPACING_MD}>
      <SettingsHelperText>{t.accent_color}</SettingsHelperText>

      <Item.Body p={4}>
        <SimpleGrid minChildWidth={"56px"} gap={2}>
          {COLOR_PALETTES.map((color, index) => {
            const isSelected = color.palette === themeContext.colorPalette;
            const isColorPaletteGray = color.palette === "gray";

            return (
              <Tooltip key={`${color.palette}-${index}`} content={color.label}>
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
  );
};

// -----------------------------------------------------------------

const RoundedSetting = () => {
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
    <StackV px={R_SPACING_MD}>
      <SettingsHelperText>{t.rounded}</SettingsHelperText>

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
                  <StackH gap={2} pl={1}>
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
              </StackV>
            );
          })}
        </SimpleGrid>
      </Item.Body>
    </StackV>
  );
};

// -----------------------------------------------------------------

const PersonalizationSection = () => {
  // Contexts
  const { t } = useLocale();

  return (
    <Item.Root>
      <Item.Header borderless color={"fg.muted"}>
        <AppIconLucide icon={BrushIcon} />

        <Item.Title>{t.personalization}</Item.Title>
      </Item.Header>

      <StackV gap={SECTION_GAP}>
        <ExampleUI />

        <AccentColorSetting />

        <RoundedSetting />
      </StackV>
    </Item.Root>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={2}>
      <DarkModeSection />

      <PersonalizationSection />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
