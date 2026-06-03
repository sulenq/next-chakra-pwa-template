"use client";

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "@/components/ui/color-mode";
import { queryClient } from "@/lib/tanstack-query/query.client";
import chakraCustomSystem from "@/themes/chakra-custom-system";
import { ChakraProvider as ChakraProviderOrigin } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// -----------------------------------------------------------------

export function ChakraProvider(props: ColorModeProviderProps) {
  return (
    <ChakraProviderOrigin value={chakraCustomSystem}>
      <ColorModeProvider {...props} />
    </ChakraProviderOrigin>
  );
}

// -----------------------------------------------------------------

export function TanstackQueryProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
