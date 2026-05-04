"use client";

import { useThemeConfig } from "@/contexts/use-theme-context";
import { Box, BoxProps, Portal } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

// -----------------------------------------------------------------

export interface TopLoadingBarProps extends BoxProps {
  loading: boolean;
}
export function TopLoadingBar(props: TopLoadingBarProps) {
  // Props
  const { loading, ...restProps } = props;

  // Contexts
  const { themeContext } = useThemeConfig();

  // States
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start loading
    if (loading) {
      setVisible(true);
      setProgress(0);

      const step = 1; // % per tick
      const tick = 20; // ms per interval

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) return 95;
          return prev + step;
        });
      }, tick);
    } else {
      // Finish loading
      if (intervalRef.current) clearInterval(intervalRef.current);
      setProgress(100);

      finishTimeoutRef.current = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 300); // fadeout
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (finishTimeoutRef.current) clearTimeout(finishTimeoutRef.current);
    };
  }, [loading]);

  console.debug({ loading, visible, progress });

  return (
    <Portal>
      <Box
        className={"LoadingBar"}
        flexShrink={0}
        w={"full"}
        h={"3px"}
        bg={"transparent"}
        position={"fixed"}
        top={0}
        left={0}
        zIndex={9999}
        {...restProps}
      >
        <Box
          flexShrink={0}
          w={`${progress}%`}
          h={"full"}
          bg={`${themeContext.colorPalette}.solid`}
          opacity={visible ? 1 : 0}
          transition={"width 200ms linear, opacity 200ms ease"}
        />
      </Box>
    </Portal>
  );
}
