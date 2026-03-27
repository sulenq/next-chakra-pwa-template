"use client";

import { P } from "@/components/ui/p";
import { StackV } from "@/components/ui/stack";
import BrandWatermark from "@/components/widgets/brand-watermark";
import { View } from "@/components/widgets/view";
import { APP } from "@/constants/_meta";
import { useLocale } from "@/contexts/useLocale";
import { interpolateString, pluckString } from "@/utils/string";
import { VStack } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { t } = useLocale();

  // States
  const variantNumber = Math.floor(Math.random() * 16) + 1;

  return (
    <View.Root p={4}>
      <VStack flex={1} gap={1} justify={"center"}>
        <StackV align={"center"} my={"auto"}>
          <StackV align={"center"} color={"fg.subtle"}>
            <P fontSize={"lg"} fontWeight={"medium"} textAlign={"center"}>
              {interpolateString(pluckString(t, `msg_welcome_to_the_app`), {
                appName: APP.name,
              })}
            </P>

            <P
              fontSize={"xl"}
              fontWeight={"medium"}
              color={"ibody"}
              textAlign={"center"}
            >
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
