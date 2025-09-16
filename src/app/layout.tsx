import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientOnlyApp from "@/components/widget/ClientOnlyApp";
import { Metadata } from "next";
import { Figtree } from "next/font/google";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: "Next Chakra PWA Template | Exium.id",
  description: "Template using Next.js + Chakra + PWA",
  icons: [
    {
      rel: "icon",
      url: "/icons/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      rel: "icon",
      url: "/icons/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  manifest: "/manifest.json",
};

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
});

const RootLayout = (props: Props) => {
  // Props
  const { children } = props;

  return (
    <html suppressHydrationWarning className={figtree.className}>
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
