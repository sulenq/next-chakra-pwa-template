import { Item } from "@/components/container/item";
import { GroupItem } from "@/components/container/group-item";
import { Btn } from "@/components/ui/btn";
import { useColorMode } from "@/components/ui/color-mode";
import { Divider } from "@/components/ui/divider";
import { P } from "@/components/ui/p";
import { RadioItem } from "@/components/ui/radio";
import { StackH, StackV } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { toaster } from "@/components/ui/toaster";
import { R_SPACING_MD } from "@/constants/styles";
import useADMStore from "@/features/settings/appearance/stores/use-adm-store";
import { useThemeStore } from "@/features/settings/appearance/stores/use-theme-store";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { formatTime } from "@/utils/formatter";
import { interpolateString } from "@/utils/string";
import { Box, BoxProps, StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const PSleleton = (props: BoxProps) => {
  return (
    <Box h={"10px"} w={"full"} bg={"bg.muted"} rounded={"full"} {...props} />
  );
};

// -----------------------------------------------------------------

interface DisplaySkeletonProps extends StackProps {
  colorMode: "light" | "dark";
}

const DisplaySkeleton = (props: DisplaySkeletonProps) => {
  // Props
  const { colorMode, ...restProps } = props;

  // Stores
  const { theme } = useThemeStore();

  // Constants
  const color = {
    canvas: {
      light: "canvasLight",
      dark: "canvasDark",
    },
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
    <StackH
      aspectRatio={4 / 3}
      w={"full"}
      rounded={theme.radii.component}
      shadow={"soft"}
      overflow={"clip"}
      {...restProps}
    >
      <StackV flex={1} gap={2} p={2} bg={color.body[colorMode]}>
        <PSleleton w={"50%"} mx={"auto"} mb={1} />

        <PSleleton />
        <PSleleton />
        <PSleleton />
      </StackV>

      <StackV flex={2} gap={2} px={4} py={2} bg={color.canvas[colorMode]}>
        <PSleleton w={"40%"} mx={"auto"} mb={1} />
      </StackV>
    </StackH>
  );
};

// -----------------------------------------------------------------

const ColorModeSetting = () => {
  // Stores
  const { theme } = useThemeStore();
  const { colorMode, setColorMode } = useColorMode();

  return (
    <StackH justify={"center"} gap={4} p={4}>
      <StackV
        align={"center"}
        gap={2}
        w={"full"}
        maxW={"200px"}
        p={R_SPACING_MD}
        rounded={theme.radii.component}
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
        rounded={theme.radii.component}
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
  // Stores
  const { t } = useLocaleStore();
  const { ADM, setADM } = useADMStore();

  return (
    <GroupItem.Root>
      <StackV gap={1}>
        <P>{t.settings_adaptive_dark_mode.title}</P>

        <P color={"fg.subtle"}>
          {interpolateString(t.settings_adaptive_dark_mode.description, {
            timeRange: `${formatTime("18:00")} - ${formatTime("06:00")}`,
          })}
        </P>
      </StackV>

      <GroupItem.ClickTarget>
        <Switch
          checked={ADM}
          onCheckedChange={(e) => {
            setADM(e.checked);
          }}
        />
      </GroupItem.ClickTarget>
    </GroupItem.Root>
  );
};

// -----------------------------------------------------------------

const ResetColorModeSetting = () => {
  // Stores
  const { t } = useLocaleStore();
  const { setColorMode } = useColorMode();

  return (
    <GroupItem.Root clickable={false}>
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
    </GroupItem.Root>
  );
};

// -----------------------------------------------------------------

export const ColorModeSection = () => {
  return (
    <Item.Root px={R_SPACING_MD}>
      <Item.Body>
        <ColorModeSetting />

        <Divider />

        <ADMSetting />

        <Divider />

        <ResetColorModeSetting />
      </Item.Body>
    </Item.Root>
  );
};
