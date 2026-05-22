"use client";

import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { P } from "@/components/ui/p";
import { BrandWatermark } from "@/components/branding/brand-watermark";
import { Logo } from "@/components/branding/logo";
import { AnimatedBlobBackground } from "@/components/overlays/background";
import { useLocaleStore } from "@/features/settings/regional/stores/use-locale-store";
import { useThemeStore } from "@/features/settings/display/stores/use-theme-store";
import { SigninForm } from "@/features/auth/components/signin-form";
import { useIsSmScreenWidth } from "@/hooks/use-is-sm-screen-width";
import { SimpleGrid } from "@chakra-ui/react";
import { StackH, StackV } from "@/components/ui/stack";

export default function Page() {
  // Store
  const { t } = useLocaleStore();
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
          {!iss && (
            <StackV
              justify={"space-between"}
              rounded={theme.radii.component}
              maxH={"calc(100dvh - 16px)"}
              overflow={"clip"}
              pos={"relative"}
            >
              <AnimatedBlobBackground />

              <StackV h={"full"} p={5} pos={"absolute"}>
                <Logo color={"white"} />

                <StackV color={"light"} mt={"auto"}>
                  <P>{t.msg_app_desc}</P>
                </StackV>
              </StackV>
            </StackV>
          )}

          <StackV
            p={4}
            gap={16}
            rounded={theme.radii.container}
            overflowY={"auto"}
          >
            <StackH justify={"center"} gap={2}>
              <ColorModeButton />

              <LangMenu />
            </StackH>

            <SigninForm />

            <BrandWatermark textAlign={"center"} />
          </StackV>
        </SimpleGrid>
      </StackV>
    </StackV>
  );
}
