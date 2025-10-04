"use client";

import { CContainer } from "@/components/ui/c-container";
import { ColorModeButton } from "@/components/ui/color-mode";
import { LangMenu } from "@/components/ui/lang-menu";
import BrandWatermark from "@/components/widget/BrandWatermark";
import Logo from "@/components/widget/Logo";
import SigninForm from "@/components/widget/SigninForm";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Box, HStack, SimpleGrid } from "@chakra-ui/react";

export default function IndexRoute() {
  // Contexts
  const { themeConfig } = useThemeConfig();

  return (
    <CContainer
      h={"100dvh"}
      align={"start"}
      bg={themeConfig.primaryColor}
      overflowY={"auto"}
    >
      <CContainer pos={"relative"} overflow={"clip"}>
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
        <CContainer
          bgPos={"center"}
          bgSize={"cover"}
          pos={"relative"}
          overflow={"clip"}
          rounded={themeConfig.radii.container}
          maxH={"calc(100dvh - 16px)"}
        >
          <Logo color={"white"} />
        </CContainer>

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
