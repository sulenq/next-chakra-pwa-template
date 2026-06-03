"use client";

import { Spinner } from "@/components/ui/spinner";
import { StackV } from "@/components/ui/stack";
import { Center, Icon, StackProps } from "@chakra-ui/react";
import { IconShieldCheckFilled } from "@tabler/icons-react";

// -----------------------------------------------------------------

export const VerifyingScreen = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  return (
    <StackV
      justify={"center"}
      align={"center"}
      minH={"100dvh"}
      w={"100vw"}
      {...restProps}
    >
      <Center pos={"relative"} color={"fg.subtle"}>
        <Icon boxSize={8}>
          <IconShieldCheckFilled />
        </Icon>

        <Spinner boxSize={"50px"} pos={"absolute"} />
      </Center>
    </StackV>
  );
};
