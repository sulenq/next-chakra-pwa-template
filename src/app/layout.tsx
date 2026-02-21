import { Provider } from "@/components/ui/provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import ClientRoot from "@/components/widget/ClientRoot";
import { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import { APP } from "@/constants/_meta";
import { disclosurePrefixId } from "@/utils/disclosure";

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
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              try {
                var nav = performance.getEntriesByType("navigation")[0];
                var isReload = nav && nav.type === "reload";
                if (!isReload) return;

                var url = new URL(window.location.href);
                var changed = false;

                url.searchParams.forEach(function(_, key) {
                  if (key.startsWith("${disclosurePrefixId}")) {
                    url.searchParams.delete(key);
                    changed = true;
                  }
                });

                if (changed) {
                  var next = url.pathname + (url.search ? "?" + url.searchParams.toString() : "");
                  window.history.replaceState({}, "", next);
                }
              } catch (_) {}
            })();
          `,
          }}
        />
        <Provider>
          <Toaster />
          <ClientRoot>{children}</ClientRoot>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
