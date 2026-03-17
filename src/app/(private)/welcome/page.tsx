"use client";

import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widgets/brand-watermark";
import { Logo } from "@/components/widgets/logo";
import { View } from "@/components/widgets/view";
import { APP } from "@/constants/_meta";
import { useLocale } from "@/contexts/useLocale";
import { pluckString } from "@/utils/string";
import { VStack } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { t } = useLocale();

  // States
  const variantNumber = Math.floor(Math.random() * 16) + 1;
  // const user = getUserData();

  return (
    <View.Container p={4}>
      <VStack flex={1} gap={1} justify={"center"}>
        <VStack my={"auto"}>
          <Logo size={65} mb={4} />

          <P fontSize={"xl"} fontWeight={"medium"} textAlign={"center"}>
            {APP.name}
          </P>

          <P color={"fg.muted"} textAlign={"center"}>
            {pluckString(t, `msg_welcome_${variantNumber}`)}
          </P>
        </VStack>

        <VStack>
          <BrandWatermark />
        </VStack>
      </VStack>
    </View.Container>
  );
}
