"use client";

import { BrandWatermark } from "@/components/branding/brand-watermark";
import { Logo } from "@/components/branding/logo";
import { RandomQuote } from "@/components/misc/random-quote";
import {
  AnimatedBlobBackground,
  AnimatedGlassPillarsBackground,
} from "@/components/overlays/background";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { StackH, StackV } from "@/components/ui/stack";
import { SigninForm } from "@/features/auth/components/signin-form";
import { useThemeStore } from "@/features/settings/views/appearance/stores/use-theme-store";
import { useIsSmScreenWidth } from "@/hooks/use-is-sm-screen-width";
import { SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  // Stores
  const { theme } = useThemeStore();

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <StackV
      bg={"bg.canvas"}
      align={"start"}
      w={"full"}
      h={"100dvh"}
      p={6}
      overflowY={"auto"}
    >
      <StackV
        flex={1}
        w={"full"}
        maxW={"1200px"}
        maxH={"700px"}
        bg={"bg.body"}
        shadow={"soft"}
        m={"auto"}
        rounded={theme.radii.container}
      >
        <SimpleGrid
          columns={[1, null, 2]}
          flex={1}
          w={"full"}
          h={"full"}
          p={2}
          overflowY={"auto"}
          gap={4}
        >
          <StackV
            p={4}
            gap={16}
            rounded={theme.radii.container}
            overflowY={"auto"}
          >
            <StackH justify={"center"} gap={2}>
              <Logo />
            </StackH>

            <SigninForm />

            <StackH align={"center"} justify={"center"}>
              <BrandWatermark color={"fg.solid"} textAlign={"center"} mr={4} />

              <StackH gap={1}>
                <ColorModeButton size={"xs"} />

                <LangMenu size={"xs"} />
              </StackH>
            </StackH>
          </StackV>

          {!iss && (
            <StackV
              justify={"space-between"}
              rounded={theme.radii.component}
              maxH={"calc(100dvh - 16px)"}
              overflow={"clip"}
              pos={"relative"}
            >
              <AnimatedBlobBackground />

              <StackV
                align={"center"}
                w={"full"}
                h={"full"}
                p={20}
                pos={"absolute"}
              >
                <RandomQuote
                  textAlign={"center"}
                  fontSize={"xl"}
                  fontWeight={"semibold"}
                  color={"light"}
                  m={"auto"}
                />
              </StackV>

              <AnimatedGlassPillarsBackground pos={"absolute"} />
            </StackV>
          )}
        </SimpleGrid>
      </StackV>
    </StackV>
  );
}
