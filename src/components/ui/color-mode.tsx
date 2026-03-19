"use client";

import { Btn } from "@/components/ui/btn";
import { Tooltip, TooltipProps } from "@/components/ui/tooltip";
import useADM from "@/contexts/useADM";
import { useLocale } from "@/contexts/useLocale";
import type { IconButtonProps, SpanProps } from "@chakra-ui/react";
import { ClientOnly, Icon, Skeleton, Span } from "@chakra-ui/react";
import { IconMoon2, IconSun } from "@tabler/icons-react";
import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider, useTheme } from "next-themes";
import * as React from "react";
import { forwardRef } from "react";

export interface ColorModeProviderProps extends ThemeProviderProps {}
interface ColorModeButtonProps extends Omit<IconButtonProps, "aria-label"> {
  tooltipProps?: Omit<TooltipProps, "content">;
}
export type ColorMode = "light" | "dark";

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  );
}

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

export const ColorModeButton = forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>((props, ref) => {
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
    <ClientOnly fallback={<Skeleton boxSize="8" />}>
      <Tooltip
        content={ADMActive ? t.msg_ADM_active : t.msg_toggle_dark_mode}
        {...tooltipProps}
      >
        <Btn
          iconButton
          clicky={false}
          ref={ref}
          variant="ghost"
          size={"sm"}
          aria-label={"Toggle color mode"}
          disabled={ADMActive}
          onClick={toggleColorMode}
          {...restProps}
        >
          <Icon boxSize={props.boxSize || 5}>
            {colorMode === "dark" ? (
              <IconMoon2 stroke={1.5} />
            ) : (
              <IconSun stroke={1.5} />
            )}
          </Icon>
        </Btn>
      </Tooltip>
    </ClientOnly>
  );
});
ColorModeButton.displayName = "ColorModeButton";

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
  },
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
  },
);
