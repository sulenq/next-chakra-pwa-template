import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientOnlyApp from "@/components/widget/ClientOnlyApp";
import { Metadata } from "next";

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
          <ClientOnlyApp>{children}</ClientOnlyApp>
          {/* {children} */}
        </Provider>
      </body>
    </html>
  );
}
