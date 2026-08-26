import type { MetadataRoute } from "next";
import { SITE } from "@/config/site";
import { getAllPosts } from "@/lib/mdx";

/**
 * Sitemap (SEO §5).
 *
 * **Sayfalama URL'leri GİRMEZ** — `/blog?page=2` bir keşif yolu, kendi başına
 * bir kaynak değil. Taslaklar zaten `getAllPosts` tarafından eleniyor.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url.replace(/\/$/, "");
  const posts = await getAllPosts();

  return [
    { url: base, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/hakkimda`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/projeler`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.9 },
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.updated ?? p.date,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
