import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { CopyButton } from "./CopyButton";

/**
 * MDX bileşen haritası (CONTENT-MODEL §2).
 *
 * Kritik kısıt: makale 3 kolonluk bir kartın içinde (~914px) render ediliyor.
 * Geniş tablolar ve uzun kod satırları taşar, o yüzden `<pre>` ve tablo
 * sarmalayıcısında `overflow-x: auto` ZORUNLU. Ham `<div>` yazma — buraya ekle.
 */

const CALLOUT = {
  info: { icon: Info, ring: "border-border-strong", tone: "text-text-2" },
  warn: { icon: TriangleAlert, ring: "border-danger/40", tone: "text-danger" },
  tip: { icon: Lightbulb, ring: "border-accent/40", tone: "text-accent" },
} as const;

export function Callout({
  type = "info",
  children,
}: {
  type?: keyof typeof CALLOUT;
  children: ReactNode;
}) {
  const { icon: Icon, ring, tone } = CALLOUT[type];

  return (
    <aside
      className={`bg-elevated rounded-inner my-5 flex gap-3 border p-4 ${ring}`}
    >
      <Icon aria-hidden className={`mt-0.5 size-4 shrink-0 ${tone}`} />
      <div className="text-body text-text-2 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}

export function Figure({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption?: string;
}) {
  return (
    <figure className="my-6">
      {/* Yerel içerik görselleri; boyutları önceden bilinmediği için `img`. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="rounded-media w-full"
        loading="lazy"
      />
      {caption && (
        <figcaption className="text-micro text-text-3 mt-2 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export function Aside({ children }: { children: ReactNode }) {
  return (
    <aside className="border-accent text-body text-text-2 my-5 border-l-2 pl-4">
      {children}
    </aside>
  );
}

/**
 * `rehype-pretty-code` `<pre>`yi üretiyor; biz yalnızca sarmalıyoruz.
 * `group` sınıfı kopyala butonunun hover'da belirmesi için.
 */
function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return (
    <div data-code-block className="group relative my-5">
      <pre
        {...props}
        tabIndex={0}
        className="bg-elevated border-border rounded-inner focus-visible:ring-accent overflow-x-auto border p-4 text-[0.85rem] leading-relaxed focus-visible:ring-2 focus-visible:outline-none"
      />
      <CopyButton />
    </div>
  );
}

/** Tablolar kart genişliğini aşabilir; sarmalayıcı olmadan kartı taşırır. */
function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="my-5 overflow-x-auto">
      <table
        {...props}
        className="text-body w-full border-collapse text-left"
      />
    </div>
  );
}

export const mdxComponents = {
  Callout,
  Figure,
  Aside,
  pre: Pre,
  table: Table,

  /*
   * `[&_a]:…` şart: `rehype-autolink-headings` (`behavior: "wrap"`) başlık
   * metnini bir `<a>` ile sarıyor ve aşağıdaki genel `a` stili onu accent'e
   * boyayıp altını çiziyordu — başlıklar yeşil çıkıyordu. Başlık içindeki
   * çapa rengi ve alt çizgiyi devralmaz.
   */
  h2: (p: ComponentPropsWithoutRef<"h2">) => (
    <h2
      {...p}
      className="font-display text-display-l text-text scroll-mt-6 pt-6 [&_a]:text-inherit [&_a]:no-underline"
    />
  ),
  h3: (p: ComponentPropsWithoutRef<"h3">) => (
    <h3
      {...p}
      className="font-display text-h-card text-text scroll-mt-6 pt-4 [&_a]:text-inherit [&_a]:no-underline"
    />
  ),
  p: (p: ComponentPropsWithoutRef<"p">) => (
    <p {...p} className="text-body text-text-2 my-4" />
  ),
  ul: (p: ComponentPropsWithoutRef<"ul">) => (
    <ul {...p} className="text-body text-text-2 my-4 list-disc pl-5" />
  ),
  ol: (p: ComponentPropsWithoutRef<"ol">) => (
    <ol {...p} className="text-body text-text-2 my-4 list-decimal pl-5" />
  ),
  li: (p: ComponentPropsWithoutRef<"li">) => <li {...p} className="my-1.5" />,
  a: (p: ComponentPropsWithoutRef<"a">) => (
    <a
      {...p}
      className="text-accent hover:text-accent-hover underline underline-offset-2"
    />
  ),
  strong: (p: ComponentPropsWithoutRef<"strong">) => (
    <strong {...p} className="text-text font-semibold" />
  ),
  blockquote: (p: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote
      {...p}
      className="border-border-strong text-text-2 my-5 border-l-2 pl-4 italic"
    />
  ),
  th: (p: ComponentPropsWithoutRef<"th">) => (
    <th {...p} className="border-border text-text border-b px-3 py-2" />
  ),
  td: (p: ComponentPropsWithoutRef<"td">) => (
    <td {...p} className="border-border text-text-2 border-b px-3 py-2" />
  ),
  hr: () => <hr className="border-border my-8" />,
};
