"use client";

import useADM from "@/context/useADM";
import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, IconButton, Skeleton, Span } from "@chakra-ui/react";
import { IconMoon2 } from "@tabler/icons-react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { LuSun } from "react-icons/lu";
import { Tooltip } from "./tooltip";
import useLang from "@/context/useLang";

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

export type ColorMode = "light" | "dark";

export interface UseColorModeReturn {
  colorMode: ColorMode;
  setColorMode: (colorMode: ColorMode) => void;
  toggleColorMode: () => void;
}

export function useColorMode(): UseColorModeReturn {
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

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? dark : light;
}

export function ColorModeIcon() {
  const { colorMode } = useColorMode();
  return colorMode === "dark" ? <IconMoon2 stroke={1.8} /> : <LuSun />;
}

interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {}

export const ColorModeButton = React.forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  // Hooks
  const { l } = useLang();
  const { toggleColorMode } = useColorMode();

  // Contexts
  const { ADM } = useADM();

  // States
  const ADMActive = ADM === "true";

  return (
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <Tooltip content={ADMActive ? l.msg_ADM_active : l.msg_toggle_dark_mode}>
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle color mode"
          size="sm"
          disabled={ADMActive}
          ref={ref}
          {...props}
        >
          <ColorModeIcon />
        </IconButton>
      </Tooltip>
    </ClientOnly>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    );
  }
);

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    );
  }
);
