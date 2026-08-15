import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { jost, inter, jetbrainsMono } from "./fonts";
import "./globals.css";

/**
 * Kök layout yalnızca belge kabuğudur. Deck kabuğu (nav, ray, footer, 100dvh
 * grid) `(deck)/layout.tsx` içindedir — böylece geliştirme aracı olan
 * `/faz-kontrol` deck'in kırmızı çizgilerine tabi olmadan normal scroll eder.
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.role}`,
    template: `%s · ${SITE.name}`,
  },
  description:
    "Anıl Gündüz — Samsun merkezli full-stack developer. Projeler, yazılar ve iletişim.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${jost.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-bg text-text">{children}</body>
    </html>
  );
}
