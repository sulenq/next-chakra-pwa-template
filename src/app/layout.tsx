import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientSideOnly from "@/components/widget/ClientSideOnly";
import { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { APP } from "@/constants/_meta";

interface Props {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  applicationName: APP.name,
  title: {
    default: APP.defaultTitle,
    template: APP.titleTemplate,
  },
  description: APP.description,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP.defaultTitle,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP.name,
    title: {
      default: APP.defaultTitle,
      template: APP.titleTemplate,
    },
    description: APP.description,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP.defaultTitle,
      template: APP.titleTemplate,
    },
    description: APP.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
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
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body>
        <Provider>
          <Toaster />
          <ClientSideOnly>{children}</ClientSideOnly>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
