"use client";

import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widgets/brand-watermark";
import { PageContainer } from "@/components/widgets/page-shell";
import { APP } from "@/constants/_meta";
import { useLocale } from "@/contexts/useLocale";
import { interpolateString, pluckString } from "@/utils/string";
import { VStack } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { t } = useLocale();

  // States
  const variantNumber = Math.floor(Math.random() * 16) + 1;
  // const user = getUserData();

  return (
    <PageContainer p={4}>
      <VStack flex={1} gap={1} justify={"center"} color={"fg.subtle"}>
        <VStack my={"auto"}>
          {/* <Avatar
            src={imgUrl(user?.avatar?.[0]?.filePath)}
            size={"2xl"}
            mb={4}
          /> */}

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
        </VStack>

        <VStack>
          <BrandWatermark />
        </VStack>
      </VStack>
    </PageContainer>
  );
}
