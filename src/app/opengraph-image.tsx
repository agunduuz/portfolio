import { ImageResponse } from "next/og";
import { SITE } from "@/config/site";

export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Anasayfa OG görseli (SEO §6).
 *
 * Renkler token'lardan DEĞİL, elle: `ImageResponse` Satori üzerinde çalışıyor
 * ve CSS değişkenlerini çözmüyor. Değerler `globals.css` ile aynı tutulmalı;
 * paleti değiştirirsen burayı da güncelle.
 */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "#121212",
        padding: 80,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          color: "#f2f2f2",
        }}
      >
        Developer. Improver.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#a8a8a8",
          marginTop: 24,
        }}
      >
        {SITE.name} — {SITE.role}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#3be8a5",
          marginTop: 40,
        }}
      >
        {SITE.url.replace(/^https?:\/\//, "")}
      </div>
    </div>,
    size,
  );
}
