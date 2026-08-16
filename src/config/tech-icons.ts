import type { BrandId } from "./brand-icons";

/**
 * Repo topic'lerini ve `primaryLanguage`'ı rozet ikonlarına çevirir
 * (CONTENT-MODEL §4).
 *
 * Kural: **eşleşmeyen teknoloji için ikon uydurma — atla.** Yanlış ikon,
 * ikon olmamasından kötüdür.
 */

export type TechId = Extract<
  BrandId,
  | "nextjs"
  | "typescript"
  | "tailwind"
  | "react"
  | "javascript"
  | "node"
  | "python"
>;

/** En fazla bu kadar ikon gösterilir; kalanı `+N` metnine düşer. */
export const MAX_TECH_ICONS = 4;

/**
 * Anahtarlar hem GitHub topic'i (küçük harf, tireli) hem `primaryLanguage.name`
 * (BÜyÜk harfli) olabilir; ikisi de aynı sözlükten geçer.
 */
export const TECH_MAP: Record<string, TechId> = {
  nextjs: "nextjs",
  "next-js": "nextjs",
  "next-dot-js": "nextjs",
  typescript: "typescript",
  tailwindcss: "tailwind",
  tailwind: "tailwind",
  "tailwind-css": "tailwind",
  react: "react",
  reactjs: "react",
  javascript: "javascript",
  nodejs: "node",
  "node-js": "node",
  python: "python",

  // `primaryLanguage.name` GitHub'da büyük harfle gelir.
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
};

/**
 * Topic listesi + dil adından sıralı, tekrarsız rozet kimlikleri üretir.
 * Sıra girdinin sırasıdır: topic'ler önce, dil en sonda — böylece
 * "nextjs, tailwindcss" yazan bir repo dilinden önce çerçevesini gösterir.
 */
export function resolveTech(
  topics: readonly string[],
  language?: string | null,
): TechId[] {
  const seen = new Set<TechId>();

  for (const key of [...topics, ...(language ? [language] : [])]) {
    const id = TECH_MAP[key] ?? TECH_MAP[key.toLowerCase()];
    if (id) seen.add(id);
  }

  return [...seen];
}
