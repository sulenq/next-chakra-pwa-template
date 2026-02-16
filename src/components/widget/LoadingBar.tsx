"use client";

import { useLoadingBar } from "@/context/useLoadingBar";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, BoxProps } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

export function LoadingBar(props: BoxProps) {
  // Contexts
  const { themeConfig } = useThemeConfig();
  const loadingBar = useLoadingBar((s) => s.loadingBar);

  // States
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const finishTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start loadingBar
    if (loadingBar) {
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
      // Finish loadingBar
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
  }, [loadingBar]);

  if (!visible) return null;

  return (
    <Box
      id="loading_bar"
      w={"full"}
      h={"3px"}
      bg={"transparent"}
      position={"fixed"}
      top={0}
      left={0}
      zIndex={9999}
      {...props}
    >
      <Box
        w={`${progress}%`}
        h={"full"}
        bg={themeConfig.primaryColor}
        transition="width 0.2s linear, opacity 0.3s ease"
      />
    </Box>
  );
}
