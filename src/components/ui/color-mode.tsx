"use client";

import { Btn } from "@/components/ui/btn";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import { AppIconLucide } from "@/components/widgets/app-icon";
import { ColorMode } from "@/constants/types";
import useADM from "@/contexts/useADM";
import { useLocale } from "@/contexts/useLocale";
import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, Skeleton, Span } from "@chakra-ui/react";
import { EclipseIcon, SunIcon } from "lucide-react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { forwardRef } from "react";

// -----------------------------------------------------------------

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute={"class"} disableTransitionOnChange {...props} />
  );
}

// -----------------------------------------------------------------

export interface UseColorMode {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorMode {
  const { resolvedTheme, setTheme } = useTheme();
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };
  return {
    colorMode: resolvedTheme as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  };
}

// -----------------------------------------------------------------

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

// -----------------------------------------------------------------

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {
  tooltipProps?: Omit<TooltipProps, "content">;
}

export const ColorModeButton = forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  // Props
  const { tooltipProps, ...restProps } = props;

  // Hooks
  const { t } = useLocale();
  const { toggleColorMode } = useColorMode();

  // Contexts
  const { colorMode } = useColorMode();
  const { ADM } = useADM();

  // States
  const ADMActive = ADM;

  return (
    <ClientOnly fallback={<Skeleton boxSize={"8"} />}>
      <Tooltip
        content={ADMActive ? t.msg_ADM_active : t.msg_toggle_dark_mode}
        {...tooltipProps}
      >
        <Btn
          iconButton
          clicky={false}
          ref={ref}
          variant={"ghost"}
          size={"sm"}
          aria-label={"Toggle color mode"}
          disabled={ADMActive}
          onClick={toggleColorMode}
          {...restProps}
        >
          <AppIconLucide icon={colorMode === "dark" ? EclipseIcon : SunIcon} />
        </Btn>
      </Tooltip>
    </ClientOnly>
  );
});

// -----------------------------------------------------------------

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color={"fg"}
        display={"contents"}
        className={"chakra-theme light"}
        colorPalette={"gray"}
        colorScheme={"light"}
        ref={ref}
        {...props}
      />
    );
  },
);

// -----------------------------------------------------------------

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color={"fg"}
        display={"contents"}
        className={"chakra-theme dark"}
        colorPalette={"gray"}
        colorScheme={"dark"}
        ref={ref}
        {...props}
      />
    );
  },
);
