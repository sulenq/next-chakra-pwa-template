"use client";

import { Btn } from "@/components/ui/btn";
import { CContainer } from "@/components/ui/c-container";
import { useColorMode } from "@/components/ui/color-mode";
import { HelperText } from "@/components/ui/helper-text";
import { P } from "@/components/ui/p";
import { SelectInput } from "@/components/ui/select-input";
import { StringInput } from "@/components/ui/string-input";
import { Switch } from "@/components/ui/switch";
import { ItemContainer } from "@/components/widget/ItemContainer";
import ItemHeaderContainer from "@/components/widget/ItemHeaderContainer";
import ItemHeaderTitle from "@/components/widget/ItemHeaderTitle";
import { SettingsItemContainer } from "@/components/widget/SettingsItemContainer";
import { OPTIONS_RELIGION } from "@/constants/selectOptions";
import useADM from "@/context/useADM";
import useLang from "@/context/useLang";
import { useSettingsRouteContainer } from "@/context/useSettingsRouteContainer";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useContainerDimension } from "@/hooks/useContainerDimension";
import { Center, HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { IconMoon2, IconPalette, IconX } from "@tabler/icons-react";
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
        onChange={() => {
          setActive(!active);
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
  const settingsRouteContainer = useSettingsRouteContainer(
    (s) => s.containerRef
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
    { palette: "pink", primaryHex: "#E91E63" },

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
    { palette: "sky", primaryHex: "#0EA5E9" },
    { palette: "blue", primaryHex: "#2196F3" },
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
    640: 5,
    960: 10,
    1200: 15,
  };
  const size = useContainerDimension(settingsRouteContainer);
  const cols = (() => {
    const width = size.width;
    let result = 3;

    for (const bp of Object.keys(gridColumns)
      .map(Number)
      .sort((a, b) => a - b)) {
      if (width >= bp) {
        result = gridColumns[bp];
      }
    }

    return result;
  })();
  const [select, setSelect] = useState<any>();

  return (
    <ItemContainer>
      <ItemHeaderContainer>
        <HStack>
          <Icon boxSize={5}>
            <IconPalette />
          </Icon>
          <ItemHeaderTitle>{l.theme}</ItemHeaderTitle>
        </HStack>
      </ItemHeaderContainer>

      <CContainer gap={4} py={3} px={3}>
        <SimpleGrid columns={cols} gap={2}>
          {colorPalettes.map((color, idx) => {
            const active = color.palette === themeConfig.colorPalette;

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
                {active && (
                  <Center p={1} rounded={"full"}>
                    <Icon boxSize={200} color={"light"} pos={"absolute"}>
                      <IconX stroke={0.5} />
                    </Icon>
                  </Center>
                )}
              </Center>
            );
          })}
        </SimpleGrid>

        {/* Example */}
        <HStack wrap={"wrap"} gapY={4}>
          <Btn
            flex={"1 1 100px"}
            colorPalette={themeConfig.colorPalette}
            size={"md"}
          >
            Button
          </Btn>
          <Btn
            flex={"1 1 100px"}
            colorPalette={themeConfig.colorPalette}
            size={"md"}
            variant={"outline"}
          >
            Button
          </Btn>
          <StringInput
            boxProps={{ flex: "1 1 100px" }}
            placeholder="example@email.com"
          />
          <SelectInput
            flex={"1 1 100px"}
            name="select1"
            selectOptions={OPTIONS_RELIGION}
            onConfirm={(inputValue) => {
              setSelect(inputValue);
            }}
            inputValue={select}
          />
        </HStack>
      </CContainer>
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

        <Theme />
      </CContainer>

      <CContainer p={4}>
        <HelperText>{l.msg_settings_saved_locally}</HelperText>
      </CContainer>
    </CContainer>
  );
};
export default SettingsDisplayRoute;
