"use client";

import { StackV } from "@/components/ui/stack";
import { getMonthNames } from "@/constants/months";
import { useLocale } from "@/contexts/use-locale-context";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

export const Test = (props: StackProps) => {
  // Contexts
  const { t } = useLocale();

  const monthNames = getMonthNames(t);

  return <StackV {...props}>{monthNames[0]}</StackV>;
};
