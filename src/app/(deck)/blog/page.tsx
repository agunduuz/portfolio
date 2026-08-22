import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LastWriting } from "@/components/modules/LastWriting";
import { PostList } from "@/components/modules/PostList";
import { Pagination } from "@/components/ui/Pagination";
import { featuredPost, getAllPosts, POSTS_PER_PAGE } from "@/lib/mdx";

export const metadata: Metadata = { title: "Yazılar" };

/**
 * Ana bölge: r1 Last Writing, r2–3 üç yazı kartı + sayfalama
 * (INTERACTIONS §2.4). Sayfalama `mt-auto` ile tabana itilir.
 *
 * Deck ile çakışma yok: `/blog` deck'in son ekranı, wheel aşağı deck sonudur
 * ve 2. sayfaya GEÇMEZ. Sayfalama yalnızca tıklamayla (PRD §7).
 */
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const requested = Number(page);

  // "?page=abc", "?page=0", "?page=-1" → 1. sayfa. Yalnızca SINIR DIŞI
  // sayfa numarası 404 verir; bozuk girdi kullanıcıyı hata sayfasına atmaz.
  const current = Number.isInteger(requested) && requested > 1 ? requested : 1;

  const posts = await getAllPosts();
  const featured = featuredPost(posts);

  // 1. sayfada öne çıkan yazı kendi kartında; listede tekrar etmez.
  // 2. sayfadan itibaren o slot yoktur, liste tüm yazılardan devam eder.
  const source =
    current === 1 && featured
      ? posts.filter((p) => p.slug !== featured.slug)
      : posts;

  const totalPages = Math.max(
    1,
    Math.ceil((featured ? posts.length - 1 : posts.length) / POSTS_PER_PAGE),
  );

  if (current > totalPages) notFound();

  const start = (current - 1) * POSTS_PER_PAGE;
  const slice = source.slice(start, start + POSTS_PER_PAGE);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-(--gap-row)">
      {current === 1 && <LastWriting post={featured} />}

      <PostList posts={slice} />

      <div className="mt-auto pt-2">
        <Pagination current={current} total={totalPages} />
      </div>
    </div>
  );
}
