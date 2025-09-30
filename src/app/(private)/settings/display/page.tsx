"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { useColorMode } from "@/components/ui/color-mode";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SelectInput } from "@/components/ui/select-input";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { SettingsItemContainer } from "@/components/widget/SettingsItemContainer";
import { Interface__SelectOption } from "@/constants/interfaces";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import useADM from "@/context/useADM";
import useLang from "@/context/useLang";
import { useSettingsRouteContainer } from "@/context/useSettingsRouteContainer";
import { useThemeConfig } from "@/context/useThemeConfig";
import {
  Box,
  Center,
  Circle,
  HStack,
  Icon,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  IconLayout,
  IconMoon2,
  IconPalette,
  IconRadiusTopLeft,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import TimePickerInput from "@/components/ui/time-picker-input";
import { getGridColumns } from "@/utils/style";

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
    <SettingsItemContainer disabled={ADM}>
      <CContainer>
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
    </SettingsItemContainer>
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
    <SettingsItemContainer>
      <CContainer>
        <P>{l.settings_adaptive_dark_mode.title}</P>
        <P color={"fg.subtle"}>{l.settings_adaptive_dark_mode.description}</P>
      </CContainer>

      <Switch
        checked={active}
        onChange={() => {
          setActive(!active);
        }}
        colorPalette={themeConfig.colorPalette}
      />
    </SettingsItemContainer>
  );
};

const DarkMode = () => {
  // Contexts
  const { l } = useLang();
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
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconMoon2 stroke={1.5} />
          </Icon>

          <ItemHeaderTitle>{l.dark_mode}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} py={3}>
        <ManualDarkModeSetting />
        <ADMSetting />
      </CContainer>
    </ItemContainer>
  );
};
const Rounded = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig, setThemeConfig } = useThemeConfig();
  const settingsContainerDimensions = useSettingsRouteContainer(
    (s) => s.containerDimension
  );

  // States
  const roundedList = [
    {
      label: "None",
      component: "0px",
      container: "0px",
    },
    {
      label: "XS",
      component: "2px",
      container: "4px",
    },
    {
      label: "Sm",
      component: "4px",
      container: "6px",
    },
    {
      label: "Md",
      component: "6px",
      container: "8px",
    },
    {
      label: "Lg",
      component: "8px",
      container: "12px",
    },
    {
      label: "XL",
      component: "12px",
      container: "16px",
    },
    {
      label: "2XL",
      component: "16px",
      container: "20px",
    },
    {
      label: "3XL",
      component: "18px",
      container: "22px",
    },
  ];
  const gridColumns: Record<number, number> = {
    320: 2,
    680: 3,
    960: 4,
    1280: 6,
    1920: 8,
  };
  const cols = getGridColumns(settingsContainerDimensions.width, gridColumns);

  // Component
  const RoundedExampe = (props: any) => {
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

          {isActive && <DotIndicator ml={0} />}

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
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconRadiusTopLeft />
          </Icon>
          <ItemHeaderTitle>{l.rounded}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} p={4}>
        <SimpleGrid columns={cols} gap={4}>
          {roundedList.map((item) => {
            const isActive = item.component === themeConfig.radii.component;

            return (
              <CContainer key={item.label}>
                <RoundedExampe preset={item} isActive={isActive} />
              </CContainer>
            );
          })}
        </SimpleGrid>
      </CContainer>
    </ItemContainer>
  );
};
const Theme = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig, setThemeConfig } = useThemeConfig();
  const settingsContainerDimensions = useSettingsRouteContainer(
    (s) => s.containerDimension
  );

  // States
  const colorPalettes = [
    { palette: "p", primaryHex: "#006aff" },

    // Neutral & Dark Shades
    { palette: "gray", primaryHex: "#1B1B1B" },
    { palette: "brown", primaryHex: "#795548" },
    { palette: "mocha", primaryHex: "#9F5D39" },
    { palette: "caramel", primaryHex: "#C47B27" },
    { palette: "cream", primaryHex: "#D7BF8C" },

    // Reds & Pinks
    { palette: "maroon", primaryHex: "#800000" },
    { palette: "red", primaryHex: "#FF0000" },
    { palette: "salmon", primaryHex: "#FF6242" },
    { palette: "flamingoPink", primaryHex: "#FF478B" },
    { palette: "bubblegumPink", primaryHex: "#FF4ABB" },

    // Oranges & Yellows
    { palette: "orange", primaryHex: "#FF8E62" },
    { palette: "pastelSalmon", primaryHex: "#FF8E62" },
    { palette: "yellow", primaryHex: "#f6e05e" },

    // Greens
    { palette: "lime", primaryHex: "#CDDC39" },
    { palette: "olive", primaryHex: "#879F30" },
    { palette: "green", primaryHex: "#4CAF50" },
    { palette: "jade", primaryHex: "#00A86B" },
    { palette: "teal", primaryHex: "#009688" },

    // Cyans & Blues
    { palette: "kemenkes", primaryHex: "#16B3AC" },
    { palette: "cyan", primaryHex: "#00BCD4" },
    { palette: "powderBlue", primaryHex: "#769cc2" },
    { palette: "sky", primaryHex: "#0EA5E9" },
    { palette: "blue", primaryHex: "#3a72ed" },
    { palette: "sapphire", primaryHex: "#1939B7" },
    { palette: "discord", primaryHex: "#5865F2" },
    { palette: "indigo", primaryHex: "#3F51B5" },

    // Purples & Lavenders
    { palette: "lavender", primaryHex: "#7A42FF" },
    { palette: "powderLavender", primaryHex: "#8E8CD8" },
    { palette: "purple", primaryHex: "#9C27B0" },
  ];
  const gridColumns: Record<number, number> = {
    320: 3,
    720: 5,
    960: 10,
  };
  const cols = getGridColumns(settingsContainerDimensions.width, gridColumns);

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconPalette stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.theme}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} p={4}>
        <SimpleGrid columns={cols} gap={2}>
          {colorPalettes.map((color, idx) => {
            const isActive = color.palette === themeConfig.colorPalette;

            return (
              <Center
                key={idx}
                w={"full"}
                aspectRatio={1}
                bg={`${color.palette}.500`}
                rounded={themeConfig.radii.component}
                cursor={"pointer"}
                overflow={"clip"}
                onClick={() => {
                  setThemeConfig({
                    colorPalette: color.palette,
                    primaryColor: `${color.palette}.500`,
                    primaryColorHex: color.primaryHex,
                  });
                }}
                pos={"relative"}
              >
                {/* <P
                  fontSize={"sm"}
                  color={`${color.palette}.contrast`}
                  textAlign={"center"}
                >
                  {color.palette}
                </P> */}

                {isActive && (
                  <DotIndicator
                    pos={"absolute"}
                    color={"light"}
                    top={2}
                    right={2}
                  />
                )}
              </Center>
            );
          })}
        </SimpleGrid>
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
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconLayout stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.example_UI}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <HStack wrap={"wrap"} gapY={4} p={4}>
        <Btn
          flex={"1 1 100px"}
          colorPalette={themeConfig.colorPalette}
          size={"md"}
        >
          Label
        </Btn>

        <Btn
          flex={"1 1 100px"}
          colorPalette={themeConfig.colorPalette}
          size={"md"}
          variant={"outline"}
        >
          Label
        </Btn>

        <StringInput flex={"1 1 200px"} placeholder="example@email.com" />

        <SelectInput
          flex={"1 1 200px"}
          name="select1"
          selectOptions={OPTIONS_RELIGION}
          onConfirm={(inputValue) => {
            setSelect(inputValue);
          }}
          inputValue={select}
          multiple
        />

        <DatePickerInput flex={"1 1 200px"} />

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
    </ItemContainer>
  );
};

const SettingsDisplayRoute = () => {
  // Contexts
  const { l } = useLang();

  return (
    <CContainer>
      <CContainer gap={4}>
        <DarkMode />

        <Rounded />

        <Theme />

        <ExampleUI />
      </CContainer>

      <CContainer p={4}>
        <HelperText>{l.msg_settings_saved_locally}</HelperText>
      </CContainer>
    </CContainer>
  );
};
export default SettingsDisplayRoute;
