"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { Logo } from "@/components/widget/Logo";
import { RandomQuote } from "@/components/widget/RandomQuote";
import { SigninForm } from "@/components/widget/SigninForm";
import { useThemeConfig } from "@/context/useThemeConfig";
import { useIsSmScreenWidth } from "@/hooks/useIsSmScreenWidth";
import { Box, HStack, SimpleGrid } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { themeConfig } = useThemeConfig();

  // Hooks
  const iss = useIsSmScreenWidth();

  return (
    <CContainer
      h={"100dvh"}
      align={"start"}
      bg={themeConfig.primaryColor}
      overflowY={"auto"}
    >
      <CContainer pos={"relative"} overflow={"clip"}>
        <>
          <Box
            w={"50%"}
            aspectRatio={1.2}
            rounded={"40%"}
            bg={`${themeConfig.colorPalette}.300`}
            animation={"rotate360 5s linear infinite"}
          />
          <Box
            w={"50%"}
            aspectRatio={1.2}
            rounded={"40%"}
            bg={`${themeConfig.colorPalette}.600`}
            animation={"rotate360 5s linear infinite"}
          />
        </>
      </CContainer>

      <SimpleGrid
        p={[2, null, 4]}
        columns={[1, null, 2]}
        flex={1}
        w={"full"}
        h={"full"}
        overflowY={"auto"}
        pos={"absolute"}
        zIndex={10}
        bg={"blackAlpha.300"}
        backdropFilter={"blur(70px)"}
        gap={4}
      >
        {!iss && (
          <CContainer
            bgPos={"center"}
            bgSize={"cover"}
            pos={"relative"}
            overflow={"clip"}
            rounded={themeConfig.radii.container}
            maxH={"calc(100dvh - 16px)"}
            justify={"space-between"}
            gap={8}
            p={4}
          >
            <Logo color={"white"} />

            <CContainer color={"light"}>
              <RandomQuote
                fontSize={"lg"}
                fontWeight={"medium"}
                maxW={"500px"}
                mb={4}
              />

              <P>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Optio
                magnam laudantium velit repellat assumenda maiores perspiciatis
                delectus? Quae quo dignissimos tempore labore illo sapiente
                voluptates, inventore, alias repudiandae laboriosam voluptatem.
              </P>

              {/* <P fontSize={"lg"} fontWeight={"medium"}>
                User these credentials to sign in,
              </P>
              <P fontSize={"lg"} fontWeight={"medium"}>
                Email: super.admin
              </P>
              <P fontSize={"lg"} fontWeight={"medium"}>
                Password: superadmin123
              </P> */}
            </CContainer>
          </CContainer>
        )}

        <CContainer
          p={8}
          gap={16}
          overflowY={"auto"}
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
  );
}
