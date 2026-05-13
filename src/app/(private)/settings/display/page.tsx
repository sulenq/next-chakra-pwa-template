"use client";

import { Btn } from "@/components/ui/btn";
import { useColorMode } from "@/components/ui/color-mode";
import { Divider } from "@/components/ui/divider";
import {
  SettingsHelperText,
  SettingsSavedLocalyHelperText,
} from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { Tooltip } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { HScroll } from "@/components/widgets/h-scroll";
import { Item } from "@/components/widgets/item";
import { ToggleSettingContainer } from "@/components/widgets/settings-shell";
import { COLOR_PALETTES } from "@/constants/colors";
import { ROUNDED_PRESETS } from "@/constants/presets";
import { R_SPACING_MD, SECTION_GAP } from "@/constants/styles";
import useADM from "@/contexts/use-adm-context";
import { useLocale } from "@/contexts/use-locale-context";
import { useThemeContext } from "@/contexts/use-theme-context";
import { formatTime } from "@/utils/formatter";
import { interpolateString } from "@/utils/string";
import { cssCalc, getSemanticValue } from "@/utils/style";
import {
  Box,
  BoxProps,
  Center,
  Circle,
  SimpleGrid,
  StackProps,
} from "@chakra-ui/react";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

const PSleleton = (props: BoxProps) => {
  return (
    <Box h={"16px"} w={"full"} bg={"bg.muted"} rounded={"full"} {...props} />
  );
};

// -----------------------------------------------------------------

interface DisplaySkeletonProps extends StackProps {
  colorMode: "light" | "dark";
}

const DisplaySkeleton = (props: DisplaySkeletonProps) => {
  // Props
  const { colorMode, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeContext();

  // Constants
  const color = {
    body: {
      light: "bodyLight",
      dark: "bodyDark",
    },
    fg: {
      light: "dark",
      dark: "light",
    },
  };

  return (
    <StackV gap={4} w={"full"} {...restProps}>
      <StackV
        gap={2}
        bg={color.body[colorMode]}
        border={"1px solid"}
        borderColor={"border.muted"}
        rounded={themeContext.radii.component}
      >
        <Center aspectRatio={1} w={"full"} p={1}>
          <Center
            w={"full"}
            h={"full"}
            bg={"bg.subtle"}
            rounded={cssCalc(`${themeContext.radii.component} - 4px`)}
          >
            <AppIconLucide
              icon={ImageIcon}
              boxSize={20}
              strokeWidth={1}
              color={color.fg[colorMode]}
              opacity={0.05}
            />
          </Center>
        </Center>

        <StackV gap={2} px={2}>
          <PSleleton w={"70%"} />
          <PSleleton />
        </StackV>

        <StackV p={2}>
          <Btn variant={"ghost"}>
            <PSleleton
              w={"70%"}
              bg={getSemanticValue(
                `${themeContext.colorPalette}.fg`,
                colorMode,
              )}
            />
          </Btn>
        </StackV>
      </StackV>
    </StackV>
  );
};

// -----------------------------------------------------------------

const ColorModeSetting = () => {
  // Contexts
  const { themeContext } = useThemeContext();
  const { colorMode, setColorMode } = useColorMode();

  return (
    <StackH justify={"center"} gap={4} px={4}>
      <StackV
        align={"center"}
        gap={4}
        w={"full"}
        maxW={"200px"}
        p={R_SPACING_MD}
        rounded={themeContext.radii.component}
        cursor={"pointer"}
        transition={"200ms"}
        _hover={{
          bg: "bg.muted",
        }}
        onClick={() => {
          setColorMode("light");
        }}
      >
        <DisplaySkeleton colorMode="light" />

        <StackV align={"center"} gap={3} pb={2}>
          <P textAlign={"center"}>Light Mode</P>

          <RadioItem checked={colorMode === "light"} />
        </StackV>
      </StackV>

      <StackV
        align={"center"}
        gap={4}
        w={"full"}
        maxW={"200px"}
        p={R_SPACING_MD}
        rounded={themeContext.radii.component}
        cursor={"pointer"}
        transition={"200ms"}
        _hover={{
          bg: "bg.muted",
        }}
        onClick={() => {
          setColorMode("dark");
        }}
      >
        <DisplaySkeleton colorMode="dark" />

        <StackV align={"center"} gap={3} pb={2}>
          <P textAlign={"center"}>Dark Mode</P>

          <RadioItem checked={colorMode === "dark"} />
        </StackV>
      </StackV>
    </StackH>
  );
};

// -----------------------------------------------------------------

const ADMSetting = () => {
  // Contexts
  const { themeContext } = useThemeContext();
  const { t } = useLocale();
  const { ADM, setADM } = useADM();

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
        checked={ADM}
        onCheckedChange={(e) => {
          setADM(e.checked);
        }}
        colorPalette={themeContext.colorPalette}
      />
    </ToggleSettingContainer>
  );
};

// -----------------------------------------------------------------

const ResetColorModeSetting = () => {
  // Contexts
  const { t } = useLocale();
  const { setColorMode } = useColorMode();

  return (
    <ToggleSettingContainer>
      <StackV gap={1}>
        <P>{t.settings_color_mode_reset.title}</P>

        <P color={"fg.subtle"}>{t.settings_color_mode_reset.description}</P>
      </StackV>

      <Btn
        variant={"outline"}
        w={"fit"}
        ml={"auto"}
        onClick={() => {
          setColorMode("system");
          toaster.info({
            title: t.info_color_mode_reset.title,
            description: t.info_color_mode_reset.description,
          });
        }}
      >
        Reset
      </Btn>
    </ToggleSettingContainer>
  );
};

// -----------------------------------------------------------------

const ColorModeSection = () => {
  // Contexts
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
    <Item.Root px={R_SPACING_MD}>
      <Item.Body gap={4} p={4}>
        <ColorModeSetting />

        <Divider />

        <ADMSetting />

        <Divider />

        <ResetColorModeSetting />
      </Item.Body>
    </Item.Root>
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
          <P color={"fg.subtle"}>{t.msg_accent_color_helper}</P>
        </StackV>
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
        <SimpleGrid minChildWidth={"160px"} gapX={1} gapY={4}>
          {ROUNDED_PRESETS.map((preset, index) => {
            const isSelected = preset.label === themeContext.radii.label;

            return (
              <StackV
                key={`${preset.label}-${index}`}
                gap={4}
                p={R_SPACING_MD}
                rounded={themeContext.radii.component}
                transition={"200ms"}
                _hover={{
                  bg: "bg.muted",
                }}
              >
                <StackV
                  gap={2}
                  aspectRatio={3 / 4}
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

                <StackV align={"center"} gap={3}>
                  <P textAlign={"center"}>{preset.label}</P>

                  <RadioItem checked={isSelected} />
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
  return (
    <Item.Root gap={2}>
      <AccentColorSetting />

      <RoundedSetting />
    </Item.Root>
  );
};

// -----------------------------------------------------------------

export default function Page() {
  return (
    <StackV gap={SECTION_GAP}>
      <ColorModeSection />

      <PersonalizationSection />

      <SettingsSavedLocalyHelperText />
    </StackV>
  );
}
