# İçerik Modeli

## 1. Blog yazısı frontmatter

`content/blog/<slug>.mdx`

```yaml
---
title: "Next.js App Router'da Streaming Nasıl Çalışır"
description: "Suspense sınırlarının gerçekten ne zaman işe yaradığı ve ne zaman gecikmeyi artırdığı."
excerpt: "Kart listelerinde görünen 2 satırlık özet."
date: 2026-03-14
updated: 2026-04-02 # opsiyonel
tags: ["nextjs", "react", "performance"]
cover: "/blog/streaming/cover.jpg" # opsiyonel, 1200x630
coverAlt: "Şelale diyagramı" # cover varsa zorunlu
featured: false # true ise "Last Writing." slotuna aday
draft: false
lang: "tr"
---
```

`description` (SEO, 150–160 karakter) ile `excerpt` (kart özeti, 2 satır) **ayrı
alanlardır**. Aynı metni iki yerde kullanmak ikisini de kötüleştirir. `excerpt` boşsa
`description` kullanılır.

Zod şeması `src/lib/mdx.ts` içinde; doğrulama build sırasında. Bozuk frontmatter build'i patlatır.

**Kurallar:**

- `slug` dosya adından gelir. Türkçe karakter yok: `nextjs-streaming-rehberi.mdx`
- `draft: true` build'e girmez, sitemap'e yazılmaz
- `readingTime` frontmatter'a yazılmaz, içerikten hesaplanır
- `updated` varsa `BlogPosting.dateModified` olur ve listede "Güncellendi" rozeti çıkar
- "Last Writing." slotu: `featured: true` olanların en yenisi; yoksa en yeni yazı

## 2. MDX bileşenleri

| Bileşen                                | Amaç                 |
| -------------------------------------- | -------------------- |
| `<Callout type="info \| warn \| tip">` | Uyarı kutusu         |
| `<CodeGroup>`                          | Sekmeli kod blokları |
| `<Figure src alt caption>`             | Başlıklı görsel      |
| `<Aside>`                              | Kenar notu           |

`src/components/mdx/` altında tanımlanır. Ham `<div>` yazma.

**Dikkat:** makale 3 kolonluk bir kart içinde (~914px) render edilir. Geniş tablolar ve
uzun kod satırları taşar. `<pre>` içinde `overflow-x: auto` ve tablolar için sarmalayıcı
`overflow-x: auto` zorunlu.

## 3. GitHub veri şemaları

```ts
type GitHubData = {
  profile: {
    login: string; // "GitHub Username" — accent
    name: string | null;
    bio: string | null; // profil kartı açıklaması
    avatarUrl: string;
    url: string; // "Go to Profile"
    repoCount: number; // "Repository 33"
  };
  repos: Project[];
};

type Project = {
  name: string;
  description: string | null;
  url: string; // "Repository ›"
  liveUrl: string | null; // "Go to Live" — null ise satır gizlenir
  coverUrl: string; // openGraphImageUrl
  hasCustomCover: boolean;
  stars: number;
  language: { name: string; color: string } | null;
  topics: string[];
  tech: TechId[]; // rozet ikonları — türetilmiş
  pushedAt: string;
  featured: boolean;
};
```

**Filtreleme:** `isFork`, `isArchived`, `isPrivate` ve `portfolio-hidden` topic'i elenir.

**Sıralama:** `config/featured-projects.ts` manuel sırası önce, kalanlar `pushedAt` desc.

**Slot dağılımı (`/projeler`):**

- Last Project → 1.
- Repo ızgarası → 2. ve 3.
- Projects kartı carousel'i → ilk 8

**Fallback:** API çökerse `featured-projects.ts` içindeki elle yazılmış 3 proje render
edilir. Kart asla boş kalmaz, donmuş iskelet bırakılmaz.

```ts
// src/config/featured-projects.ts
export const FEATURED = [
  { repo: "portfolio", live: "https://anilgunduz.dev", order: 1 },
  { repo: "…", live: null, order: 2 },
  { repo: "…", live: null, order: 3 },
] as const;
```

## 4. Teknoloji rozetleri

Tasarımda repo kartlarında üç ikon (Next.js, TypeScript, Tailwind). Topic'ler ve
`primaryLanguage` üzerinden türetilir.

```ts
// src/config/tech-icons.ts
export const TECH_MAP: Record<string, TechId> = {
  nextjs: "nextjs",
  "next-js": "nextjs",
  typescript: "typescript",
  tailwindcss: "tailwind",
  tailwind: "tailwind",
  react: "react",
  nodejs: "node",
  postgresql: "postgres",
  TypeScript: "typescript",
  JavaScript: "javascript",
  Python: "python",
};
```

- En fazla 4 ikon; fazlası `+2` metni
- Eşleşmeyen teknoloji için ikon **uydurma** — atla
- Her ikonda `<title>` ve `aria-label`
- İkonlar `simple-icons`'tan inline SVG olarak kopyalanır; paketi bağımlılık ekleme

**Senin işin:** GitHub'da her projeye `nextjs`, `typescript`, `tailwindcss` gibi topic'ler
ekle — rozetler oradan gelecek. Gizlemek istediklerine `portfolio-hidden` ekle.

## 5. Arayüz metinleri

Arayüz İngilizce (tasarımdaki gibi), blog Türkçe. Tek yerde:

```ts
// src/config/site.ts
export const COPY = {
  hero: {
    title: "Developer. Improver.",
    bio: "I enjoy creating websites using new technologies. I see each task as a challenge for myself. Through these tasks, I can learn new things and reinforce what I already know.",
  },
  aboutMe: {
    statusPrefix: "I'm working right now about",
    currentFocus: "Portfolio Web Page", // elle güncellenir
    counterLabel: "The Time Spent",
    more: "More",
  },
  jobOffers: {
    title: "Job Offers.",
    lead: "Do you want to work with me?",
    fields: {
      location: "What is your job location?",
      type: "What is your job type?",
      technology: "What is your base technology?",
      amount: "What is your offer amount?",
    },
    submit: "Send the Offer.",
    pending: "Sending…",
    success: "Offer sent.",
  },
  subscribe: {
    title: "Subscribe.",
    // İKİ FARKLI ALT METİN — tasarımda böyle
    homeLead: "Yeni yazılar ve proje güncellemeleri için e-posta bırak.",
    detailLead: "Subscribed for next writing",
    submit: "Enter.",
    success: "Kayıt tamam. İlk yazıda görüşürüz.",
  },
} as const;
```

**Not:** anasayfa Subscribe kartındaki metin tasarımda lorem ipsum. Gerçek metin yaz.

**"Go to X" kalıbı:** `Go to` gri, hedef bold beyaz.
`Go to **Live**` · `Go to **Writing.**` · `Go to **Detail**` · `Go to **Profile**`

**Alt link kalıbı:** `More ›` · `Repository ›` · `Detail ›`

**Ünlem uyarısı:** tasarımdaki "Writings Heading!" bir placeholder'dır. Gerçek başlıklara
ünlem taşıma.

## 6. Site kimliği

```ts
export const SITE = {
  name: "Anıl Gündüz",
  role: "Full-Stack Developer",
  url: "https://anilgunduz.dev",
  location: "Samsun, Türkiye",
  email: "…",
  resume: "/anil-gunduz-cv.pdf",
  socials: [
    { name: "GitHub", url: "…", icon: "github" },
    { name: "LinkedIn", url: "…", icon: "linkedin" },
    { name: "X", url: "…", icon: "x" },
    { name: "Medium", url: "…", icon: "medium" },
    { name: "Instagram", url: "…", icon: "instagram" },
    { name: "Upwork", url: "…", icon: "upwork" },
    { name: "Mail", url: "mailto:…", icon: "mail" },
  ],
} as const;
```

Bu değerler JSON-LD `Person.sameAs`, footer ve hero'da aynı yerden okunur.
İki yerde ayrı yazılan bir link er geç ayrışır.

`careerStart` burada değil, `NEXT_PUBLIC_CAREER_START` env değişkenindedir — sayaç
onu okur.

## 7. Hakkımda içeriği

```ts
// src/config/about.ts
export const ABOUT = {
  summary: `2–3 paragraf gerçek biyografi.`,
  jobHistory: [
    {
      company: "…",
      role: "…",
      from: "2023-01",
      to: null,
      outcome: "Tek satır çıktı.",
    },
  ],
} as const;
```

`to: null` → "Günümüz". Tarih biçimi tutarlı: `Oca 2023 — Günümüz`.

Ek başlıklar (`Skills`, `Education`) **aynı kartın içine** eklenir, yeni kart açılmaz.
Yetenek seviyesi yüzdesi kullanma — uydurma veridir.

## 8. Yazı tonu

- Sistemin nasıl kurulduğunu değil, kullanıcının ne yaptığını adlandır
- Bir eylem akış boyunca aynı adı taşır
- Boş durum bir davettir: "Henüz yazı yok." değil → "İlk yazı yolda. Abone ol, haber vereyim."
- Hata mesajı ne olduğunu ve nasıl düzeltileceğini söyler, özür dilemez

**Lorem ipsum yasak.** Yayın öncesi `grep -ri "lorem" src content` çalıştır, sonuç boş olmalı.
