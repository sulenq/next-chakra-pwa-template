"use client";

import { P } from "@/components/ui/p";
import BrandWatermark from "@/components/widget/BrandWatermark";
import { PageContainer } from "@/components/widget/Page";
import { APP } from "@/constants/_meta";
import useLang from "@/context/useLang";
import { interpolateString, pluckString } from "@/utils/string";
import { VStack } from "@chakra-ui/react";

export default function Page() {
  // Contexts
  const { l } = useLang();

  // States
  const variantNumber = Math.floor(Math.random() * 16) + 1;
  // const user = getUserData();

  const userInput = `<img src="x"onerror="console.debug('HACKED:', localStorage.__auth_token)"/>`;

  return (
    <PageContainer p={4}>
      <VStack flex={1} gap={1} justify={"center"} color={"fg.subtle"}>
        <VStack my={"auto"}>
          {/* <Avatar
            src={imgUrl(user?.avatar?.[0]?.filePath)}
            size={"2xl"}
            mb={4}
          /> */}

          <div dangerouslySetInnerHTML={{ __html: userInput }} />

          <P fontSize={"lg"} fontWeight={"medium"}>
            {interpolateString(pluckString(l, `msg_welcome_to_the_app`), {
              appName: APP.name,
            })}
          </P>

          <P fontSize={"xl"} fontWeight={"medium"} color={"ibody"}>
            {pluckString(l, `msg_welcome_${variantNumber}`)}
          </P>
        </VStack>

        <VStack>
          <BrandWatermark />
        </VStack>
      </VStack>
    </PageContainer>
  );
}
