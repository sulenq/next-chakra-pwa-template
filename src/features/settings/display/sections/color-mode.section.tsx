import { Btn } from "@/components/ui/btn";
import { useColorMode } from "@/components/ui/color-mode";
import { Divider } from "@/components/ui/divider";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { AppIconLucide } from "@/components/branding/app-icon";
import { Item } from "@/components/container/item";
import { SettingItemContainer } from "@/components/container/settings-shell";
import { R_SPACING_MD } from "@/constants/styles";
import useADM from "@/features/settings/display/contexts/use-adm-context";
import { useLocaleContext } from "@/features/settings/regional/contexts/use-locale-context";
import { useThemeContext } from "@/features/settings/display/contexts/use-theme-context";
import { formatTime } from "@/utils/formatter";
import { interpolateString } from "@/utils/string";
import { cssCalc, getSemanticValue } from "@/utils/style";
import { Box, BoxProps, Center, StackProps } from "@chakra-ui/react";
import { ImageIcon } from "lucide-react";

// -----------------------------------------------------------------

export const PSleleton = (props: BoxProps) => {
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
          <Btn
            variant={"ghost"}
            _hover={{
              bg: getSemanticValue(
                `${themeContext.colorPalette}.subtle`,
                colorMode,
              ),
            }}
            _active={{
              bg: getSemanticValue(
                `${themeContext.colorPalette}.muted`,
                colorMode,
              ),
            }}
          >
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
    <StackH justify={"center"} gap={4} p={2} pb={4}>
      <StackV
        align={"center"}
        gap={2}
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

        <StackV align={"center"} gap={2}>
          <P textAlign={"center"}>Light Mode</P>

          <RadioItem checked={colorMode === "light"} />
        </StackV>
      </StackV>

      <StackV
        align={"center"}
        gap={2}
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

        <StackV align={"center"} gap={2}>
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
  const { t } = useLocaleContext();
  const { ADM, setADM } = useADM();

  return (
    <SettingItemContainer>
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
      />
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

const ResetColorModeSetting = () => {
  // Contexts
  const { t } = useLocaleContext();
  const { setColorMode } = useColorMode();

  return (
    <SettingItemContainer>
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
    </SettingItemContainer>
  );
};

// -----------------------------------------------------------------

export const ColorModeSection = () => {
  return (
    <Item.Root px={R_SPACING_MD}>
      <Item.Body>
        <ColorModeSetting />

        <Divider mx={4} />

        <ADMSetting />

        <Divider mx={4} />

        <ResetColorModeSetting />
      </Item.Body>
    </Item.Root>
  );
};
