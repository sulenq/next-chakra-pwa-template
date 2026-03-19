"use client";

import { useColorModeValue } from "@/components/ui/color-mode";
import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
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

  // Constants
  const logoColor = useColorModeValue("var(--chakra-colors-d2)", "black");

  return (
    <View.Root p={4}>
      <VStack flex={1} gap={1} justify={"center"}>
        <StackV align={"center"} my={"auto"}>
          <Logo size={65} color={logoColor} mb={4} />

          <StackV align={"center"} color={"fg.subtle"}>
            <P fontSize={"xl"} fontWeight={"medium"} textAlign={"center"}>
              {APP.name}
            </P>

            <P textAlign={"center"}>
              {pluckString(t, `msg_welcome_${variantNumber}`)}
            </P>
          </StackV>
        </StackV>

        <VStack>
          <BrandWatermark />
        </VStack>
      </VStack>
    </View.Root>
  );
}
