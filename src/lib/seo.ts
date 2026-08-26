import { SITE } from "@/config/site";
import type { Post } from "@/lib/mdx";
import type { Project } from "@/lib/github";

/**
 * JSON-LD üreticileri (SEO §3).
 *
 * `Person.sameAs` kaynağı `config/site.ts` — ikinci bir yere yazma, er geç
 * ayrışır. **Görünmeyen içeriği işaretleme**; yapısal veri sayfada gerçekten
 * duran şeyi tarif etmeli, cezaya açık.
 */

const base = SITE.url.replace(/\/$/, "");

export const personSchema = {
  "@type": "Person",
  "@id": `${base}/#person`,
  name: SITE.name,
  jobTitle: SITE.role,
  url: base,
  email: `mailto:${SITE.email}`,
  address: { "@type": "PostalPlace", name: SITE.location },
  sameAs: SITE.socials
    .filter((s) => !s.url.startsWith("mailto:"))
    .map((s) => s.url),
} as const;

export const websiteSchema = {
  "@type": "WebSite",
  "@id": `${base}/#website`,
  url: base,
  name: SITE.name,
  inLanguage: "tr-TR",
  publisher: { "@id": `${base}/#person` },
} as const;

export function projectListSchema(projects: Project[]) {
  return {
    "@type": "ItemList",
    name: "Projeler",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: p.name,
        ...(p.description ? { description: p.description } : {}),
        // Private projede repo URL'i YOK; olmayan bir adresi işaretlemeyiz.
        ...(p.url ? { codeRepository: p.url } : {}),
        ...(p.language ? { programmingLanguage: p.language.name } : {}),
        ...(p.liveUrl ? { url: p.liveUrl } : {}),
      },
    })),
  };
}

export function blogSchema(posts: Post[]) {
  return {
    "@type": "Blog",
    "@id": `${base}/blog#blog`,
    name: "Yazılar",
    inLanguage: "tr-TR",
    publisher: { "@id": `${base}/#person` },
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${base}/blog/${p.slug}`,
      datePublished: p.date,
      ...(p.updated ? { dateModified: p.updated } : {}),
    })),
  };
}

export function postSchema(post: Post) {
  const url = `${base}/blog/${post.slug}`;

  return [
    {
      "@type": "BlogPosting",
      "@id": `${url}#post`,
      headline: post.title,
      description: post.description,
      url,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      inLanguage: post.lang === "tr" ? "tr-TR" : post.lang,
      wordCount: post.wordCount,
      keywords: post.tags,
      author: { "@id": `${base}/#person` },
      publisher: { "@id": `${base}/#person` },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      ...(post.cover ? { image: `${base}${post.cover}` } : {}),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Anasayfa", item: base },
        {
          "@type": "ListItem",
          position: 2,
          name: "Yazılar",
          item: `${base}/blog`,
        },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
}
