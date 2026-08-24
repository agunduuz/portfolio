import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { z } from "zod";

/**
 * Blog veri katmanı (ARCHITECTURE §6, CONTENT-MODEL §1).
 *
 * GitHub'ın aksine burada **bozuk veri sessizce yutulmaz**: frontmatter şemaya
 * uymuyorsa build patlar. Sebep sahiplik — GitHub harici bir servis, onun
 * çökmesi bizim hatamız değil ve fallback doğru cevap. `content/blog/` ise
 * bizim dosyalarımız; bozuk frontmatter bir yazım hatasıdır ve yayına
 * çıkmadan görülmelidir.
 */

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

const FrontmatterSchema = z.object({
  title: z.string().min(1),
  /** SEO açıklaması, 150–160 karakter. `excerpt` ile AYNI ŞEY DEĞİL. */
  description: z.string().min(1),
  /** Kart listesinde görünen 2 satırlık özet. Boşsa `description` kullanılır. */
  excerpt: z.string().optional(),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  cover: z.string().optional(),
  coverAlt: z.string().optional(),
  /** `true` ise "Last Writing." slotuna aday. */
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  lang: z.string().default("tr"),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;

export type Post = {
  slug: string;
  title: string;
  description: string;
  /** Her zaman dolu: frontmatter'da yoksa `description`'a düşer. */
  excerpt: string;
  date: string;
  updated: string | null;
  tags: string[];
  cover: string | null;
  coverAlt: string | null;
  featured: boolean;
  draft: boolean;
  lang: string;
  /** Dakika cinsinden, yukarı yuvarlanmış. Frontmatter'a yazılmaz, hesaplanır. */
  readingMinutes: number;
  wordCount: number;
};

export type Heading = { id: string; text: string; level: 2 | 3 };

/** Gövde metni yalnızca yazı detayında gerekir; liste bunu taşımaz. */
export type PostWithBody = Post & { body: string; headings: Heading[] };

/**
 * `rehype-slug`'ın ürettiği id ile AYNI olmalı, yoksa içindekiler linkleri
 * hiçbir yere gitmez. GitHub-slugger davranışı: küçült, aksanları ayrıştır,
 * harf/rakam/boşluk/tire dışını at, boşlukları tireye çevir.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Başlıkları ham MDX'ten çıkarır. Kod bloklarının içindeki `#` satırları
 * başlık DEĞİLDİR — shell yorumu ya da CSS id'si olabilir; önce fence'leri eler.
 */
function extractHeadings(body: string): Heading[] {
  const withoutCode = body.replace(/^```[\s\S]*?^```/gm, "");
  const headings: Heading[] = [];

  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = (match[2] ?? "").replace(/[*_`]/g, "");
    headings.push({
      id: slugify(text),
      text,
      level: match[1]?.length === 2 ? 2 : 3,
    });
  }

  return headings;
}

function parse(slug: string, raw: string): PostWithBody {
  const { data, content } = matter(raw);
  const parsed = FrontmatterSchema.safeParse(data);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".") || "(kök)"}: ${i.message}`)
      .join("; ");
    throw new Error(`Bozuk frontmatter — content/blog/${slug}.mdx → ${issues}`);
  }

  const fm = parsed.data;
  const stats = readingTime(content);

  return {
    slug,
    title: fm.title,
    description: fm.description,
    excerpt: fm.excerpt?.trim() || fm.description,
    date: fm.date.toISOString(),
    updated: fm.updated?.toISOString() ?? null,
    tags: fm.tags,
    cover: fm.cover ?? null,
    coverAlt: fm.coverAlt ?? null,
    featured: fm.featured,
    draft: fm.draft,
    lang: fm.lang,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    wordCount: stats.words,
    body: content,
    headings: extractHeadings(content),
  };
}

async function readAll(): Promise<PostWithBody[]> {
  let files: string[];

  try {
    files = await readdir(CONTENT_DIR);
  } catch {
    // Klasör henüz yoksa blog boştur — bu bir hata değil, bir durum.
    return [];
  }

  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        return parse(
          slug,
          await readFile(path.join(CONTENT_DIR, file), "utf8"),
        );
      }),
  );

  // Taslaklar build'e girmez ve sitemap'e yazılmaz (CONTENT-MODEL §1).
  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Liste için — gövde taşımaz, en yeniden eskiye sıralı, taslaklar elenmiş.
 *
 * Gövde bilinçli olarak düşürülüyor: bu veri kalıcı kabuktan geçip Writings
 * kartına kadar iniyor, her yazının tam metnini yanında taşımasının anlamı yok.
 */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await readAll();

  return posts.map((post) => {
    const list: Post & { body?: string; headings?: Heading[] } = { ...post };
    delete list.body;
    delete list.headings;
    return list;
  });
}

export async function getPost(slug: string): Promise<PostWithBody | null> {
  const posts = await readAll();
  return posts.find((p) => p.slug === slug) ?? null;
}

/**
 * Önceki/sonraki yazı. Liste en yeniden eskiye sıralı olduğu için `prev`
 * dizide BİR ÖNCEKİ, yani daha YENİ yazıdır — okuyucunun beklediği yön bu.
 */
export async function getNeighbours(
  slug: string,
): Promise<{ prev: Post | null; next: Post | null }> {
  const posts = await getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);

  if (index === -1) return { prev: null, next: null };

  return {
    prev: posts[index - 1] ?? null,
    next: posts[index + 1] ?? null,
  };
}

/** `?reader=1` teklifi bu eşiğin üstünde gösterilir (INTERACTIONS §5.2). */
export const READER_MODE_WORDS = 2000;

/**
 * "Last Writing." slotu: `featured: true` olanların EN YENİSİ; yoksa en yeni
 * yazı (CONTENT-MODEL §1).
 */
export function featuredPost(posts: Post[]): Post | null {
  return posts.find((p) => p.featured) ?? posts[0] ?? null;
}

export const POSTS_PER_PAGE = 3;
