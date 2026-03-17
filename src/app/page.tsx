"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widgets/brand-watermark";
import { Logo } from "@/components/widgets/logo";
import { AnimatedBlobBackground } from "@/components/widgets/background";
import { useLocale } from "@/contexts/useLocale";
import { useThemeConfig } from "@/contexts/useThemeConfig";
import { SigninForm } from "@/features/auth/signin-form";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { HStack, SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { t } = useLocale();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer align={"start"} h={"100dvh"} p={6} overflowY={"auto"}>
      <CContainer
        flex={1}
        maxW={"1200px"}
        maxH={"720px"}
        bg={"bg.body"}
        m={"auto"}
        rounded={themeConfig.radii.container}
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
            <CContainer
              justify={"space-between"}
              rounded={themeConfig.radii.container}
              maxH={"calc(100dvh - 16px)"}
              overflow={"clip"}
              pos={"relative"}
            >
              <AnimatedBlobBackground />

              <CContainer h={"full"} p={5} pos={"absolute"}>
                <Logo color={"white"} />

                <CContainer color={"light"} mt={"auto"}>
                  {/* <RandomQuote
                    fontSize={"lg"}
                    fontWeight={"medium"}
                    maxW={"500px"}
                    mb={4}
                  /> */}

                  <P>{t.msg_app_desc}</P>
                </CContainer>
              </CContainer>
            </CContainer>
          )}

          <CContainer
            p={4}
            gap={16}
            bg={"bg.body"}
            rounded={themeConfig.radii.container}
          >
            <HStack justify={"center"}>
              <ColorModeButton />

              <LangMenu />
            </HStack>

            <SigninForm />

            <BrandWatermark textAlign={"center"} />
          </CContainer>
        </SimpleGrid>
      </CContainer>
    </CContainer>
  );
}
