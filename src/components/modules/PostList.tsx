import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { COPY } from "@/config/site";
import type { Post } from "@/lib/mdx";

/**
 * `/blog` r2–r3 — yazı listesi (DESIGN-SYSTEM §6 "Liste kartı").
 *
 * Kartın TAMAMI tıklanabilir ama iç içe `<a>` YOK: başlıktaki tek `<Link>`
 * `::after` ile kartın üstüne yayılıyor (`after:absolute after:inset-0`).
 * İkinci bir sarmalayıcı `<a>` eklemek HTML'i geçersiz kılar ve ekran
 * okuyucuda her kartı iki kez duyurur.
 *
 * "Go to Detail" bu yüzden link değil, metin — zaten kartın tamamı link.
 */
export function PostList({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;

  return (
    <ul className="flex min-h-0 flex-1 flex-col gap-(--gap-row)">
      {posts.map((post) => (
        <li key={post.slug} className="flex min-h-0 flex-1">
          <Card
            size="md"
            className="hover:bg-surface-hover relative w-full justify-center"
          >
            <h2 className="text-h-item text-accent">
              <Link
                href={`/blog/${post.slug}`}
                className="focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner after:absolute after:inset-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {post.title}
              </Link>
            </h2>

            <p className="text-body text-text-2 mt-2 line-clamp-2">
              {post.excerpt}
            </p>

            <p className="text-label text-text-3 mt-2">
              Go to{" "}
              <strong className="text-text font-semibold">
                {COPY.writings.detail}
              </strong>
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
