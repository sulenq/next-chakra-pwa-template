"use client";

import chakraCustomSystem from "@/theme/chakraCustomSystem";
import { ChakraProvider } from "@chakra-ui/react";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={chakraCustomSystem}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
