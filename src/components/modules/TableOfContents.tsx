import type { Heading } from "@/lib/mdx";

/**
 * İçindekiler (INTERACTIONS §5.2).
 *
 * Başlıklar MDX'ten değil, ham metinden çıkarılıyor (`lib/mdx.ts` → `headings`)
 * — böylece render ağacını gezmek gerekmiyor ve liste sunucuda hazır oluyor.
 *
 * 768px altında GİZLİ: dar ekranda makalenin yerini çalar. Kısa yazıda hiç
 * render edilmez; üç başlıklı bir yazı için içindekiler gürültüdür.
 */
export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 3) return null;

  return (
    <nav
      aria-label="İçindekiler"
      className="border-border mb-6 hidden border-b pb-4 md:block"
    >
      <p className="text-micro text-text-3 mb-2">İçindekiler</p>

      <ul className="flex flex-col gap-1.5">
        {headings.map((h) => (
          <li key={h.id} className={h.level === 3 ? "pl-4" : undefined}>
            <a
              href={`#${h.id}`}
              className="text-label text-text-2 hover:text-text focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
