"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { Checkbox } from "@/components/ui/checkbox";
import { useColorMode } from "@/components/ui/color-mode";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SelectInput } from "@/components/ui/select-input";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { DotIndicator } from "@/components/widget/Indicator";
import { ItemContainer } from "@/components/widget/ItemContainer";
import { ItemHeaderContainer } from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { SettingsItemContainer } from "@/components/widget/SettingsItemContainer";
import { COLOR_PALETTES } from "@/constants/colors";
import { Interface__SelectOption } from "@/constants/interfaces";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import useADM from "@/context/useADM";
import useLang from "@/context/useLang";
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
  IconColorSwatch,
  IconLayout,
  IconMoon2,
  IconRadiusTopLeft,
} from "@tabler/icons-react";
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
const Theme = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconColorSwatch stroke={1.5} />
          </Icon>
          <ItemHeaderTitle>{l.theme}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} p={4}>
        <SimpleGrid columns={[3, null, 5, null, 10]} gap={2}>
          {COLOR_PALETTES.map((color, idx) => {
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
const Rounded = () => {
  // Contexts
  const { l } = useLang();
  const { themeConfig, setThemeConfig } = useThemeConfig();

  // Hooks
  const containerRef = useRef<HTMLDivElement>(null);

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
    <ItemContainer ref={containerRef}>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconRadiusTopLeft />
          </Icon>
          <ItemHeaderTitle>{l.rounded}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} p={4}>
        <SimpleGrid columns={[2, null, 4, null, null, 6]} gap={4}>
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

        <Btn
          flex={"1 1 100px"}
          colorPalette={themeConfig.colorPalette}
          size={"md"}
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

export default function Page() {
  // Contexts
  const { l } = useLang();

  return (
    <CContainer>
      <CContainer gap={4}>
        <DarkMode />

        <Theme />

        <Rounded />

        <ExampleUI />
      </CContainer>

      <CContainer p={4}>
        <HelperText>{l.msg_settings_saved_locally}</HelperText>
      </CContainer>
    </CContainer>
  );
}
