"use client";

import { CContainer } from "@/components/ui/c-container";
import { getMonthNames } from "@/shared/constants/months";
import { useLocale } from "@/contexts/useLocale";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const Test = (props: StackProps) => {
  // Contexts
  const { t } = useLocale();

  const monthNames = getMonthNames(t);

  return <CContainer {...props}>{monthNames[0]}</CContainer>;
};
