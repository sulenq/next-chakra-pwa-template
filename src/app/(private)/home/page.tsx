"use client";

import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { Logo } from "@/components/widget/Logo";
import { PageContainer } from "@/components/widget/Page";
import { VStack } from "@chakra-ui/react";

export default function Page() {
  // Contexts

  return (
    <PageContainer p={4}>
      <VStack flex={1} gap={1} justify={"center"} color={"fg.subtle"}>
        <Logo size={32} color="#8a8a8a85" mb={2} />

        <P
          fontSize={"lg"}
          fontWeight={"bold"}
          textAlign={"center"}
          color={"ibody"}
        >
          Exium.id
        </P>

        <BrandWatermark />
      </VStack>
    </PageContainer>
  );
}
