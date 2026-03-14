import localFont from "next/font/local";

export const miSans = localFont({
  src: [
    {
      path: "./MiSansLatin-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./MiSansLatin-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./MiSansLatin-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-mi-sans",
});
