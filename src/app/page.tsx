"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { Logo } from "@/components/widget/Logo";
import { SigninForm } from "@/components/widget/SigninForm";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { Box, HStack, SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer
      h={"100dvh"}
      align={"start"}
      bg={"bgContent"}
      overflowY={"auto"}
    >
      <CContainer
        flex={1}
        maxW={"1200px"}
        maxH={"720px"}
        bg={"body"}
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
              <CContainer h={"full"} bg={`${themeConfig.colorPalette}.900`}>
                <CContainer flex={1} pos={"relative"}>
                  <Box
                    w="full"
                    h="full"
                    aspectRatio={1}
                    bg={`${themeConfig.colorPalette}.500`}
                    borderRadius="60% 40% 70% 30% / 50% 60% 40% 70%"
                    animation="rotate360 5s linear infinite"
                    pos={"absolute"}
                    bottom={"-20%"}
                    right={"-20%"}
                  />

                  <Box
                    w="65%"
                    h="65%"
                    aspectRatio={1}
                    bg={`${themeConfig.colorPalette}.800`}
                    borderRadius="30% 70% 40% 60% / 60% 40% 70% 30%"
                    animation="rotate360 7s linear infinite"
                    pos={"absolute"}
                    bottom={"-20%"}
                    left={"-20%"}
                  />

                  <Box
                    w="40%"
                    h="40%"
                    aspectRatio={1}
                    bg={`${themeConfig.colorPalette}.600`}
                    borderRadius="60% 40% 70% 30% / 100% 60% 40% 70%"
                    animation="rotate360 5s linear infinite"
                    pos={"absolute"}
                    top={"10%"}
                    left={"-10%"}
                  />
                </CContainer>
              </CContainer>

              <CContainer
                h={"full"}
                p={5}
                backdropFilter={"blur(100px)"}
                pos={"absolute"}
              >
                <Logo color={"white"} />

                <CContainer color={"light"} mt={"auto"}>
                  {/* <RandomQuote
                    fontSize={"lg"}
                    fontWeight={"medium"}
                    maxW={"500px"}
                    mb={4}
                  /> */}

                  <P>{l.msg_app_desc}</P>
                </CContainer>
              </CContainer>
            </CContainer>
          )}

          <CContainer
            p={4}
            gap={16}
            bg={"body"}
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
