import { useColorModeValue } from "@/components/ui/color-mode";
import { StackV } from "@/components/ui/stack";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { Box, Center, Circle, StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const RadialGlowBackground = (props: StackProps) => {
  // Contexts
  const { themeConfig } = useThemeConfig();

  // Constants
  const colorPalette = themeConfig.colorPalette;
  const opacity1 = useColorModeValue(0.2, 0.15);
  const opacity2 = useColorModeValue(0.2, 0.15);

  return (
    <Center w={"full"} h={"full"} overflow={"clip"} {...props}>
      <StackV w={"full"} h={"full"} pos={"relative"}>
        <Circle
          aspectRatio={1}
          w={"16%"}
          bg={`${colorPalette}.solid`}
          opacity={opacity1}
          pos={"absolute"}
          left={"0"}
          top={"0"}
          transform={"translate(-50%, -50%)"}
        />

        <Circle
          aspectRatio={1}
          w={"80%"}
          bg={`${colorPalette}.subtle`}
          opacity={opacity2}
          pos={"absolute"}
          right={"0"}
          bottom={"-50%"}
          // transform={"translate(-50%, -50%)"}
        />
      </StackV>

      {/* Blur overlay */}
      <StackV
        w={"full"}
        h={"full"}
        backdropFilter={"blur(100px)"}
        pos={"absolute"}
        left={0}
        top={0}
      />
    </Center>
  );
};

// -----------------------------------------------------------------

interface AnimatedBlobBackgroundProps extends Omit<
  StackProps,
  "animationDuration"
> {
  /**
   * Base animation duration in milliseconds (ms).
   */
  animationDuration?: number;
}

export const AnimatedBlobBackground = (props: AnimatedBlobBackgroundProps) => {
  const { animationDuration = 5000, ...restProps } = props;

  const { themeConfig } = useThemeConfig();

  const dur1 = animationDuration;
  const dur2 = Math.round(animationDuration * 1.4);
  const dur3 = Math.round(animationDuration * 0.8);

  return (
    <StackV
      h={"full"}
      bg={`${themeConfig.colorPalette}.900`}
      pos={"relative"}
      overflow={"clip"}
      {...restProps}
    >
      <StackV flex={1} pos={"relative"}>
        <Box
          w={"full"}
          h={"full"}
          aspectRatio={1}
          bg={`${themeConfig.colorPalette}.500`}
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
          bg={`${themeConfig.colorPalette}.800`}
          borderRadius={"30% 70% 40% 60% / 60% 40% 70% 30%"}
          animation={`rotate360 ${dur2}ms linear infinite`}
          pos={"absolute"}
          bottom={"-20%"}
          left={"-20%"}
        />

        <Box
          w={"40%"}
          h={"40%"}
          aspectRatio={1}
          bg={`${themeConfig.colorPalette}.600`}
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
        backdropFilter={"blur(80px)"}
        pos={"absolute"}
        top={0}
        left={0}
      />
    </StackV>
  );
};
