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
import { AppIcon } from "@/components/widget/AppIcon";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { LocalSettingsHelperText } from "@/components/widget/LocalSettingsHelperText";
import { ToggleSettingContainer } from "@/components/widget/SettingsShell";
import { COLOR_PALETTES } from "@/constants/colors";
import { Interface__SelectOption } from "@/constants/interfaces";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import useADM from "@/context/useADM";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
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
  const { l } = useLang();
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
        <P>{l.settings_dark_mode.title}</P>
        <P color={"fg.subtle"}>{l.settings_dark_mode.description}</P>
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
  const { l } = useLang();
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
        <P>{l.settings_adaptive_dark_mode.title}</P>

        <P color={"fg.subtle"}>
          {interpolateString(l.settings_adaptive_dark_mode.description, {
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

const DarkMode = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();
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
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={EclipseIcon} />

          <ItemHeaderTitle>{l.dark_mode}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          px={4}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <ManualDarkModeSetting />
          <ADMSetting />
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const AccentColor = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <ItemContainer ref={containerRef} borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={SwatchBookIcon} />

          <ItemHeaderTitle>{l.accent_color}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <SimpleGrid minChildWidth={"56px"} gap={2}>
            {COLOR_PALETTES.map((color, index) => {
              const isActive = color.palette === themeConfig.colorPalette;
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

                    {isActive && (
                      <DotIndicator
                        pos={"absolute"}
                        color={isColorPaletteGray ? "body" : "light"}
                        top={2}
                        right={2}
                      />
                    )}
                  </Center>
                </Tooltip>
              );
            })}
          </SimpleGrid>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const Rounded = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // Component
  const RoundedExampel = (props: any) => {
    // Props
    const { preset, isActive } = props;

    // Utils
    function handleOnClick() {
      setThemeConfig({
        ...themeConfig,
        radii: {
          component: preset.component,
          container: preset.container,
        },
      });
    }

    return (
      <CContainer
        gap={2}
        aspectRatio={1}
        p={2}
        rounded={preset.container}
        border={"1px solid"}
        borderColor={"border.emphasized"}
        cursor={"pointer"}
        onClick={handleOnClick}
        pos={"relative"}
      >
        <HStack pl={1}>
          <P>{preset.label}</P>

          {isActive && <DotIndicator />}

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
    );
  };

  return (
    <ItemContainer ref={containerRef} borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={SquareRoundCornerIcon} />

          <ItemHeaderTitle>{l.rounded}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <CContainer
          gap={4}
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
          <SimpleGrid minChildWidth={"140px"} gap={4}>
            {ROUNDED_PRESETS.map((item, index) => {
              const isActive = item.component === themeConfig.radii.component;

              return (
                <CContainer key={`${item.label}-${index}`}>
                  <RoundedExampel preset={item} isActive={isActive} />
                </CContainer>
              );
            })}
          </SimpleGrid>
        </CContainer>
      </CContainer>
    </ItemContainer>
  );
};
const ExampleUI = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // States
  const [checked, setChecked] = useState<boolean>(true);
  const [select, setSelect] = useState<
    Interface__SelectOption[] | null | undefined
  >(null);

  return (
    <ItemContainer borderless roundedless>
      <ItemHeaderContainer borderless>
        <HStack>
          <AppIcon icon={LayoutPanelLeftIcon} />

          <ItemHeaderTitle>{l.example_UI}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer px={4}>
        <HStack
          wrap={"wrap"}
          gapY={4}
          p={3}
          rounded={themeConfig.radii.container}
          border={"1px solid"}
          borderColor={"border.muted"}
        >
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
            id="example_select_religion"
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
      </CContainer>
    </ItemContainer>
  );
};

export default function Page() {
  return (
    <CContainer flex={1} gap={3}>
      <DarkMode />

      <AccentColor />

      <Rounded />

      <ExampleUI />

      <LocalSettingsHelperText />
    </CContainer>
  );
}
