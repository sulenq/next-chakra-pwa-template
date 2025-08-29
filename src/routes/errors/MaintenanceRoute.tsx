"use client";

import BButton from "@/components/ui-custom/Btn";
import Divider from "@/components/ui-custom/Divider";
import NavLink from "@/components/ui-custom/NavLink";
import P from "@/components/ui-custom/P";
import ExiumWatermark from "@/components/widget/ExiumWatermark";
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
          <BButton colorPalette={themeConfig.colorPalette}>
            {l.back_to_main_page}
          </BButton>
        </NavLink>
      </VStack>

      <VStack w={"full"} py={4}>
        <ExiumWatermark />
      </VStack>
    </VStack>
  );
}
