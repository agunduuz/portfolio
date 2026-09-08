import { SITE } from "@/config/site";
import { getAllPosts } from "@/lib/mdx";

/** XML metin düğümlerinde beşi de kaçırılmalı; yazı başlıkları buraya akıyor. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(): Promise<Response> {
  const base = SITE.url.replace(/\/$/, "");
  const posts = await getAllPosts();

  const items = posts
    .map((p) =>
      [
        "    <item>",
        `      <title>${escapeXml(p.title)}</title>`,
        `      <link>${base}/blog/${p.slug}</link>`,
        `      <guid isPermaLink="true">${base}/blog/${p.slug}</guid>`,
        `      <description>${escapeXml(p.excerpt)}</description>`,
        `      <pubDate>${new Date(p.date).toUTCString()}</pubDate>`,
        "    </item>",
      ].join("\n"),
    )
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(SITE.name)} — Yazılar</title>`,
    `    <link>${base}/blog</link>`,
    `    <description>${escapeXml(SITE.name)} tarafından yazılan teknik yazılar.</description>`,
    "    <language>tr</language>",
    `    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
