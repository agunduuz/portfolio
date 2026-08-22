import { Card } from "@/components/ui/Card";
import { ArrowLink, GoTo } from "@/components/ui/Link";
import { COPY } from "@/config/site";
import type { Post } from "@/lib/mdx";

/**
 * `/blog` r1 — öne çıkan yazı (PRD §7).
 *
 * Yalnızca 1. sayfada görünür; 2. sayfadan itibaren o slot listenin devamına
 * dönüşür (ARCHITECTURE §6). Aynı yazıyı her sayfada tekrar göstermek hem yer
 * israfı hem içerik tekrarı.
 */
export function LastWriting({ post }: { post: Post | null }) {
  if (!post) {
    return (
      <Card title={COPY.writings.last} size="lg" as="h1">
        <p className="text-body text-text-2 my-auto text-center text-balance">
          {COPY.writings.empty}
        </p>
      </Card>
    );
  }

  return (
    <Card title={COPY.writings.last} size="lg" as="h1">
      <article className="mt-4 flex min-h-0 flex-1 flex-col gap-2">
        <h2 className="text-h-item text-accent">{post.title}</h2>
        <p className="text-body text-text-2 line-clamp-3">{post.excerpt}</p>
        <GoTo href={`/blog/${post.slug}`} target={COPY.writings.detail} />
      </article>

      <div className="mt-auto flex shrink-0 justify-center pt-4">
        <ArrowLink href={`/blog/${post.slug}`}>
          {COPY.writings.detail}
        </ArrowLink>
      </div>
    </Card>
  );
}
