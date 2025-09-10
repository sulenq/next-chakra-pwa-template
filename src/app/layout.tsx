import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientOnlyApp from "@/components/widget/ClientOnlyApp";
import { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Next Chakra PWA Template | Exium.id",
  description: "Template that using Next.js, Chakra UI, and PWA by Exium.id",
};

const RootLayout = (props: Props) => {
  // Props
  const { children } = props;

  return (
    <html suppressHydrationWarning className={GeistSans.className}>
      <body>
        <Provider>
          <Toaster />
          <ClientOnlyApp>{children}</ClientOnlyApp>
        </Provider>
      </body>
    </html>
  );
};
export default RootLayout;
