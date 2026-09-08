import localFont from "next/font/local";

export const jost = localFont({
  src: "../../public/fonts/jost/Jost.woff2",
  variable: "--font-jost",
  display: "swap",
  weight: "100 900",
});

export const inter = localFont({
  src: [
    {
      path: "../../public/fonts/inter/Inter.woff2",
      style: "normal",
      weight: "100 900",
    },
    {
      path: "../../public/fonts/inter/Inter-Italic.woff2",
      style: "italic",
      weight: "100 900",
    },
  ],
  variable: "--font-inter",
  display: "swap",
});

export const jetbrainsMono = localFont({
  src: "../../public/fonts/jetbrains-mono/JetBrainsMono.woff2",
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: "100 800",
});
