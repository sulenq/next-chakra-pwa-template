"use client";

import { CContainer } from "@/components/ui/c-container";
import { getMonthNames } from "@/constants/months";
import useLang from "@/context/useLang";
import { StackProps } from "@chakra-ui/react";

interface Props extends StackProps {}

export const Test = (props: Props) => {
  // Props
  const { ...restProps } = props;

  // Contexts
  const { l } = useLang();

  const monthNames = getMonthNames(l);

  return <CContainer {...restProps}>{monthNames[0]}</CContainer>;
};
