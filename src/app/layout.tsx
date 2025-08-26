import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next Chakra PWA Template | Exium.id",
  description: "Template that using Next.js, Chakra UI, and PWA by Exium.id",
};

export default function RootLayout(props: { children: React.ReactNode }) {
  // Props
  const { children } = props;

  return (
    <html suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
