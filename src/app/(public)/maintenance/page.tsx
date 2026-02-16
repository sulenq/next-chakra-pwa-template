"use client";

import { Btn } from "@/components/ui/btn";
import { Divider } from "@/components/ui/divider";
import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widget/BrandWatermark";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { HStack, VStack } from "@chakra-ui/react";

export default function MaintenanceRoute() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <VStack h={"100vh"} gap={0}>
      <VStack p={8} flex={1} justify={"center"} gap={4} w={"full"}>
        <HStack>
          <Divider dir={"vertical"} w={"20px"} h={"2px"} />
          <P fontWeight={"bold"} fontSize={"lg"} color={"fg.subtle"}>
            503
          </P>
          <Divider dir={"vertical"} w={"20px"} h={"2px"} />
        </HStack>

        <P textAlign={"center"} fontSize={"xl"} fontWeight={"bold"}>
          Maintenance
        </P>

        <P textAlign={"center"} mb={4} maxW={"450px"} color={"fg.subtle"}>
          {l.maintenance_route.description}
        </P>

        <NavLink to={"/"} w={"fit"}>
          <Btn colorPalette={themeConfig.colorPalette} px={8}>
            {l.main_page}
          </Btn>
        </NavLink>
      </VStack>

      <VStack w={"full"} py={4}>
        <BrandWatermark />
      </VStack>
    </VStack>
  );
}
