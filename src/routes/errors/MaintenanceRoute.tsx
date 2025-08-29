"use client";

import BButton from "@/components/ui-custom/Btn";
import NavLink from "@/components/ui-custom/NavLink";
import ExiumWatermark from "@/components/widget/ExiumWatermark";
import useLang from "@/context/useLang";
import { useThemeConfig } from "@/context/useThemeConfig";
import { Text, VStack } from "@chakra-ui/react";

export default function MaintenanceRoute() {
  // Contexts
  const { l } = useLang();
  const { themeConfig } = useThemeConfig();

  return (
    <VStack h={"100vh"} gap={0}>
      <VStack p={8} flex={1} justify={"center"} gap={4} w={"full"}>
        <Text textAlign={"center"} fontSize={32} fontWeight={600}>
          503 Maintenance
        </Text>

        <Text textAlign={"center"} mb={4} maxW={"600px"} color={"fg.muted"}>
          {l.maintenance_page.description}
        </Text>

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
