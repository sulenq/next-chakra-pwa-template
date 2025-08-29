import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import ClientOnly from "@/components/widget/ClientOnly";
import type { Metadata } from "next";
import "./globals.css";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Next Chakra PWA Template | Exium.id",
  description: "Template that using Next.js, Chakra UI, and PWA by Exium.id",
};

export default function RootLayout(props: Props) {
  // Props
  const { children } = props;

  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>
          <Toaster />
          <ClientOnly>{children}</ClientOnly>
        </Provider>
      </body>
    </html>
  );
}
