import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Card } from "@/components/ui/Card";
import { ArticleShell } from "@/components/modules/ArticleShell";
import { TableOfContents } from "@/components/modules/TableOfContents";
import { mdxComponents } from "@/components/mdx";
import {
  getAllPosts,
  getNeighbours,
  getPost,
  READER_MODE_WORDS,
} from "@/lib/mdx";
import { JsonLd } from "@/components/JsonLd";
import { postSchema } from "@/lib/seo";

/** Tüm yazılar build'de üretilir; yayın sonrası eklenen slug ISR ile gelir. */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "Yazı bulunamadı" };

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      modifiedTime: post.updated ?? undefined,
      tags: post.tags,
    },
  };
}

/**
 * `as const` YOK: readonly dizi `Pluggable[]`e atanamıyor, MDXRemote mutable
 * bekliyor. `satisfies` ile tip güvenliği korunuyor ama dizi mutable kalıyor.
 *
 * `keepBackground: false` — kod bloğunun zemini temadan değil, kendi
 * token'ımızdan (`bg-elevated`) gelsin.
 */
const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [
        rehypePrettyCode,
        { theme: "github-dark-default", keepBackground: false },
      ],
    ],
  },
} satisfies Parameters<typeof MDXRemote>[0]["options"];

/**
 * Yazı detayı — deck DIŞINDA ama aynı kabuğun içinde (PRD §8).
 *
 * Makale kartı `data-scrollable`; kartın içi scroll eder, sayfa değil.
 * Deck navigasyonu bu route'ta tamamen kapalı (`useDeckNavigation` erken
 * dönüyor), çıkış `Esc` veya nav ile.
 *
 * `?reader=1`: uzun yazılarda ray gizlenir ve makale 4 kolona yayılır. Bu
 * kararın bedeli dürüstçe kabul edilmişti — kutu içinde uzun metin okumak
 * zahmetlidir; reader modu iki kaçış kapısından biri.
 */
export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reader?: string }>;
}) {
  const [{ slug }, { reader }] = await Promise.all([params, searchParams]);
  const post = await getPost(slug);

  if (!post) notFound();

  const { prev, next } = await getNeighbours(slug);
  const isReader = reader === "1";
  const offersReader = post.wordCount > READER_MODE_WORDS;

  return (
    <Card size="lg" className="relative">
      <JsonLd schemas={postSchema(post)} />

      {/*
        Reader modunun kabuğa ulaşma yolu. CSS `:has([data-reader])` ile bu
        işareti görüp rayı gizliyor ve makaleyi dört kolona yayıyor
        (globals.css). Sebebi page-manifest.ts'te yazılı: query parametresini
        JS'te okumak tüm sayfaları statik olmaktan çıkarıyordu.
      */}
      {isReader && <div data-reader hidden />}

      <ArticleShell label="Yazı içeriği">
        <div className="mx-auto max-w-[72ch]">
          <header>
            <h1 className="font-display text-display-l text-text">
              {post.title}
            </h1>

            <p className="text-micro text-text-3 mt-2 flex flex-wrap items-center gap-x-3">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readingMinutes} dk okuma</span>
              {post.updated && (
                <span>Güncellendi: {formatDate(post.updated)}</span>
              )}
            </p>

            <p className="text-body-l text-text-2 mt-4">{post.description}</p>

            {offersReader && (
              <Link
                href={
                  isReader
                    ? `/blog/${post.slug}`
                    : `/blog/${post.slug}?reader=1`
                }
                className="text-label text-accent hover:text-accent-hover focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner mt-4 inline-block transition-colors duration-(--dur-micro) focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                {isReader ? "← Normal görünüm" : "Tam ekran oku →"}
              </Link>
            )}
          </header>

          <hr className="border-border my-6" />

          <TableOfContents headings={post.headings} />

          <MDXRemote
            source={post.body}
            components={mdxComponents}
            options={mdxOptions}
          />

          <nav
            aria-label="Diğer yazılar"
            className="border-border mt-10 flex flex-wrap gap-4 border-t pt-6"
          >
            {prev && <Neighbour post={prev} direction="prev" />}
            {next && <Neighbour post={next} direction="next" />}
          </nav>
        </div>
      </ArticleShell>
    </Card>
  );
}

function Neighbour({
  post,
  direction,
}: {
  post: { slug: string; title: string };
  direction: "prev" | "next";
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group focus-visible:ring-accent focus-visible:ring-offset-surface rounded-inner flex max-w-[48%] flex-col gap-1 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
        direction === "next" ? "ml-auto items-end text-right" : ""
      }`}
    >
      <span className="text-micro text-text-3">
        {direction === "prev" ? "← Daha yeni" : "Daha eski →"}
      </span>
      <span className="text-label text-text-2 group-hover:text-text transition-colors duration-(--dur-micro)">
        {post.title}
      </span>
    </Link>
  );
}

/** Sunucu ve istemci aynı sonucu vermeli — sabit locale, sabit zaman dilimi. */
function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
