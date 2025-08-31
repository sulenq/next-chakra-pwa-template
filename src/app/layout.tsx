"use client";

import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

interface Props {
  children: React.ReactNode;
}

export default function RootLayout(props: Props) {
  // Props
  const { children } = props;

  return (
    <html suppressHydrationWarning>
      <head>
        <title>Next Chakra PWA Template | Exium.id</title>
        <meta
          name="description"
          content="Template that using Next.js, Chakra UI, and PWA by Exium.id"
        />
      </head>
      <body>
        <Provider>
          <Toaster />
          {/* <ClientOnly>{children}</ClientOnly> */}
          {children}
        </Provider>
      </body>
    </html>
  );
}
