import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";

/**
 * `/api/` kapalı: revalidate webhook'u bir sayfa değil, uç nokta.
 * `/faz-kontrol` de kapalı — geliştirme aracı, yayında silinecek ama
 * o güne kadar indekslenmesin.
 */
export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/faz-kontrol"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
