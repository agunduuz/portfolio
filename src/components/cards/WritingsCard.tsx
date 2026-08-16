import { Card, type CardSize } from "@/components/ui/Card";
import { Carousel } from "@/components/ui/Carousel";
import { ArrowLink, GoTo } from "@/components/ui/Link";
import { COPY } from "@/config/site";

/** `lib/mdx.ts`'in yazı tipi (Faz 5) bu şeklin üstüne oturur. */
export type WritingItem = {
  slug: string;
  title: string;
  excerpt: string;
};

/**
 * Projects kartının ikizi ama rozet yok — Chanel kuralı: bir kartta hem
 * başlık, hem özet, hem link, hem rozet olsaydı biri fazla olurdu
 * (DESIGN-SYSTEM §0).
 */
export function WritingsCard({
  size = "sm",
  writings = [],
}: {
  size?: CardSize;
  /** Faz 5'te `content/blog/*.mdx`'ten gelir. */
  writings?: readonly WritingItem[];
}) {
  return (
    <Card title={COPY.writings.title} size={size}>
      {writings.length === 0 ? (
        <Empty />
      ) : (
        <Carousel id="writings" label="Yazılar">
          {writings.map((writing) => (
            <Slide key={writing.slug} writing={writing} />
          ))}
        </Carousel>
      )}

      <div className="mt-auto flex justify-center pt-4">
        <ArrowLink href="/blog">{COPY.writings.more}</ArrowLink>
      </div>
    </Card>
  );
}

function Slide({ writing }: { writing: WritingItem }) {
  return (
    <article className="flex flex-col gap-2">
      <h4 className="text-h-item text-accent">{writing.title}</h4>
      <p className="text-body text-text-2 line-clamp-3">{writing.excerpt}</p>
      <GoTo href={`/blog/${writing.slug}`} target={COPY.writings.goTo} />
    </article>
  );
}

function Empty() {
  return (
    <p className="text-body text-text-2 my-auto text-center text-balance">
      {COPY.writings.empty}
    </p>
  );
}
