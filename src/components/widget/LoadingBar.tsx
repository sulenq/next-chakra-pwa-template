"use client";

import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, BoxProps } from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";

interface LoadingBarProps extends BoxProps {
  loading: boolean;
}

export function LoadingBar({ loading, ...restProps }: LoadingBarProps) {
  // Contexts
  const { themeConfig } = useThemeConfig();

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

  if (!visible) return null;

  return (
    <Box
      position={"fixed"}
      top={0}
      left={0}
      width={"100%"}
      height={"1px"}
      bg={"transparent"}
      zIndex={9999}
      {...restProps}
    >
      <Box
        width={`${progress}%`}
        height={"full"}
        bg={themeConfig.primaryColor}
        transition="width 0.2s linear, opacity 0.3s ease"
      />
    </Box>
  );
}
