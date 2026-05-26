import { StackH, StackV } from "@/components/ui/stack";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { Box, StackProps } from "@chakra-ui/react";
import { useRef, useState } from "react";

// -----------------------------------------------------------------

interface AnimatedBlobBackgroundProps extends Omit<
  StackProps,
  "animationDuration"
> {
  animationDuration?: number; // ms
}

export const AnimatedBlobBackground = (props: AnimatedBlobBackgroundProps) => {
  const { animationDuration = 5000, ...restProps } = props;

  const { theme } = useThemeStore();

  const dur1 = animationDuration;
  const dur2 = Math.round(animationDuration * 1.4);
  const dur3 = Math.round(animationDuration * 0.8);

  return (
    <StackV
      h={"full"}
      bg={`${theme.colorPalette}.700`}
      pos={"relative"}
      overflow={"clip"}
      {...restProps}
    >
      <StackV flex={1} pos={"relative"}>
        <Box
          w={"full"}
          h={"full"}
          aspectRatio={1}
          bg={`${theme.colorPalette}.500`}
          borderRadius={"60% 40% 70% 30% / 50% 60% 40% 70%"}
          animation={`rotate360 ${dur1}ms linear infinite`}
          pos={"absolute"}
          bottom={"-20%"}
          right={"-20%"}
        />

        <Box
          w={"65%"}
          h={"65%"}
          aspectRatio={1}
          bg={`${theme.colorPalette}.700`}
          borderRadius={"30% 70% 40% 60% / 60% 40% 70% 30%"}
          animation={`rotate360 ${dur2}ms linear infinite`}
          pos={"absolute"}
          bottom={"-30%"}
          left={"-20%"}
        />

        <Box
          w={"40%"}
          h={"40%"}
          aspectRatio={1}
          bg={`${theme.colorPalette}.600`}
          borderRadius={"60% 40% 70% 30% / 100% 60% 40% 70%"}
          animation={`rotate360 ${dur3}ms linear infinite`}
          pos={"absolute"}
          top={"10%"}
          left={"-10%"}
        />
      </StackV>

      <Box
        w={"full"}
        h={"full"}
        backdropFilter={"blur(60px)"}
        pos={"absolute"}
        top={0}
        left={0}
      />
    </StackV>
  );
};

// -----------------------------------------------------------------

export const AnimatedGlassPillarsBackground = (props: StackProps) => {
  // Stores
  const { theme } = useThemeStore();

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);

  // States
  const [cursorX, setCursorX] = useState<number>(0.5);

  // Utils
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    setCursorX(Math.max(0, Math.min(1, x)));
  };

  return (
    <StackH
      ref={containerRef}
      w={"full"}
      h={"full"}
      onMouseMove={handleMouseMove}
      {...props}
    >
      {Array.from({ length: 10 }, (_, i) => {
        const pillarX = i / 9;
        const opacity = Math.abs(pillarX - cursorX);

        return (
          <Box
            key={i}
            flex={1}
            h={"full"}
            bg={`${theme.colorPalette}.emphasized`}
            transition={"opacity 100ms ease-out"}
            style={{ opacity }}
            shadow={"soft"}
          />
        );
      })}
    </StackH>
  );
};
