import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";
import { getPost } from "@/lib/mdx";

export const alt = "Yazı";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Yazı başına dinamik OG görseli (SEO §6).
 * Renkler elle — Satori CSS değişkeni çözmez, bkz. app/opengraph-image.tsx.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const title = post?.title ?? "Yazı bulunamadı";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#121212",
        padding: 80,
      }}
    >
      <div style={{ display: "flex", fontSize: 26, color: "#3be8a5" }}>
        Yazılar
      </div>

      <div
        style={{
          display: "flex",
          fontSize: title.length > 48 ? 56 : 68,
          fontWeight: 700,
          color: "#f2f2f2",
          lineHeight: 1.15,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", fontSize: 28, color: "#a8a8a8" }}>
        {SITE.name}
        {post ? ` · ${post.readingMinutes} dk okuma` : ""}
      </div>
    </div>,
    size,
  );
}
