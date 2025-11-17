"use client";

import { CContainer } from "@/components/ui/c-container";
import { StackProps } from "@chakra-ui/react";

interface Props extends StackProps {}

export const PDFViewer = (props: Props) => {
  // Props
  const { ...restProps } = props;

  return <CContainer {...restProps}></CContainer>;
};
