"use client";

import { CContainer } from "@/components/ui/c-container";
import { Spinner } from "@/components/ui/spinner";
import { Center, Icon, StackProps } from "@chakra-ui/react";
import { IconShieldCheckFilled } from "@tabler/icons-react";

interface Props extends StackProps {}

export const VerifyingScreen = (props: Props) => {
  // Props
  const { ...restProps } = props;

  return (
    <CContainer
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
    </CContainer>
  );
};
