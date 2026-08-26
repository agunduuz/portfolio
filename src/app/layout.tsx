import type { Metadata } from "next";
import { SITE } from "@/config/site";
import { JsonLd } from "@/components/JsonLd";
import { personSchema, websiteSchema } from "@/lib/seo";
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
    "Anıl Gündüz — Samsun merkezli full-stack developer. Modern web teknolojileriyle hızlı ve erişilebilir arayüzler geliştiriyorum.",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: SITE.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${jost.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="bg-bg text-text">
        {/* WebSite + Person her sayfada; sayfaya özgü şemalar route'larda. */}
        <JsonLd schemas={[websiteSchema, personSchema]} />
        {children}
      </body>
    </html>
  );
}
