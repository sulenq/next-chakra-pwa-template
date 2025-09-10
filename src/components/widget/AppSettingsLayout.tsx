"use client";

import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";

export const AppSettingsLayout = (props: StackProps) => {
  // Props
  const { ...restProps } = props;

  return <CContainer id={"settings_container"} {...restProps}></CContainer>;
};
