"use client";

import { CContainer } from "@/components/ui/c-container";
import { HStack, StackProps } from "@chakra-ui/react";

export const AppSettingsLayout = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  return (
    <CContainer id={"settings_container"} overflowY={"auto"} {...restProps}>
      <HStack>
        <CContainer w={"300px"} className="scrollY"></CContainer>

        <CContainer></CContainer>
      </HStack>
    </CContainer>
  );
};
