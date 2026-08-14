# Mimari

## 1. Stack ve gerekçe

| Katman    | Seçim                 | Neden                                              |
| --------- | --------------------- | -------------------------------------------------- |
| Framework | Next.js 15 App Router | Route bazlı SSG/ISR, metadata API, `ImageResponse` |
| Dil       | TypeScript strict     | Harici veri var; tip güvenliği pazarlık dışı       |
| Stil      | Tailwind CSS v4       | CSS-first `@theme`, config dosyası yok             |
| Animasyon | `motion`              | Uydu kartların `layout` animasyonu için zorunlu    |
| İçerik    | MDX (dosya tabanlı)   | Tek yazar için CMS gereksiz gecikme                |
| Mail      | Resend + React Email  | Server Action'dan tek çağrı                        |
| Doğrulama | Zod                   | Form + GitHub yanıtı + frontmatter aynı araçla     |
| Hosting   | Vercel                | ISR ve edge cache framework'le hizalı              |

**Bilinçli kullanılmayanlar:** state kütüphanesi, UI kit, Contentlayer, GSAP, i18n.

---

## 2. Klasör yapısı

```
src/
├── app/
│   ├── layout.tsx                # KALICI KABUK: nav, ray, footer, deck controller
│   ├── page.tsx                  # Anasayfa
│   ├── hakkimda/page.tsx
│   ├── projeler/page.tsx
│   ├── blog/
│   │   ├── page.tsx              # liste + ?page=N
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── opengraph-image.tsx
│   ├── api/revalidate/route.ts
│   ├── actions/{subscribe,job-offer}.ts
│   ├── sitemap.ts · robots.ts · rss.xml/route.ts · opengraph-image.tsx
│   ├── not-found.tsx · error.tsx
│
├── components/
│   ├── shell/
│   │   ├── DeckShell.tsx         # 100dvh kabuk, 12 kolon grid
│   │   ├── SatelliteRail.tsx     # "use client" — kalıcı kartlar + layout animasyonu
│   │   ├── DeckController.tsx    # "use client" — wheel/klavye
│   │   ├── Nav.tsx · Footer.tsx
│   ├── cards/                    # HeroCard, ProjectsCard, WritingsCard,
│   │                             # AboutMeCard, JobOffersCard, SubscribeCard
│   ├── modules/                  # SummaryModule, LastProject, RepoGrid,
│   │                             # GitHubProfile, LastWriting, PostList, Article
│   └── ui/                       # Button, Input, Field, TechBadges, Carousel,
│                                 # Pagination, CoverImage, ReadingProgress
├── lib/
│   ├── github.ts · mdx.ts · seo.ts · env.ts · rate-limit.ts
├── hooks/
│   ├── useDeckNavigation.ts · useElapsed.ts · useProxiedWheel.ts
├── config/
│   ├── site.ts                   # kimlik, sosyal linkler, deck sırası
│   ├── page-manifest.ts          # hangi sayfada hangi kart, hangi grid alanında
│   ├── featured-projects.ts
│   └── tech-icons.ts
└── content/blog/*.mdx
```

---

## 3. Kalıcı kabuk mimarisi (projenin kalbi)

### 3.1 Problem

Uydu kartlar sayfalar arasında **taşınmalı**, yeniden doğmamalı. Kart her route'ta
`page.tsx` içinde render edilirse Next.js onu unmount edip yeniden mount eder — Motion
`layout` animasyonu çalışmaz, carousel'in konumu sıfırlanır, sayaç yeniden başlar.

### 3.2 Çözüm

Uydu kartlar `app/layout.tsx` içinde yaşar. `layout.tsx` route değişiminde **yeniden render
edilmez**; React ağacında kalır. Sayfa dosyaları yalnızca ana bölgeyi doldurur.

```tsx
// src/app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [repos, posts, profile] = await Promise.all([
    getRepos(),
    getAllPosts(),
    getProfile(),
  ]);

  return (
    <html lang="tr" className={fonts}>
      <body>
        <DeckShell>
          <Nav />
          <div className="deck-grid">
            <SatelliteRail repos={repos} posts={posts} />
            <main id="main" className="deck-main">
              {children}
            </main>
          </div>
          <Footer />
        </DeckShell>
      </body>
    </html>
  );
}
```

Veri layout'ta bir kez çekilir ve ray ile ana bölge aynı kaynağı kullanır. `Promise.all` ile
paralel; `fetch` cache'i sayesinde aynı istek iki kez gitmez.

### 3.3 Sayfa manifestosu

Hangi sayfada hangi kartın nerede olacağı tek bir dosyada tanımlanır:

```ts
// src/config/page-manifest.ts
export type CardId =
  | "projects"
  | "writings"
  | "aboutMe"
  | "jobOffers"
  | "subscribe"
  | "hero";

export const MANIFEST: Record<
  string,
  {
    railSide: "left" | "right" | "none";
    rail: { id: CardId; area: string }[]; // CSS grid-area
    mainArea: string;
  }
> = {
  "/": {
    railSide: "none",
    rail: [
      { id: "aboutMe", area: "1 / 1 / 3 / 4" },
      { id: "projects", area: "1 / 4 / 2 / 7" },
      { id: "writings", area: "1 / 7 / 2 / 10" },
      { id: "subscribe", area: "2 / 4 / 3 / 10" },
      { id: "jobOffers", area: "1 / 10 / 3 / 13" },
    ],
    mainArea: "hero",
  },
  "/hakkimda": {
    railSide: "right",
    rail: [
      { id: "projects", area: "1 / 10 / 2 / 13" },
      { id: "jobOffers", area: "2 / 10 / 4 / 13" },
    ],
    mainArea: "1 / 1 / 4 / 10",
  },
  "/projeler": {
    railSide: "left",
    rail: [
      { id: "writings", area: "1 / 1 / 2 / 4" },
      { id: "aboutMe", area: "2 / 1 / 4 / 4" },
    ],
    mainArea: "1 / 4 / 4 / 13",
  },
  "/blog": {
    railSide: "right",
    rail: [
      { id: "projects", area: "1 / 10 / 2 / 13" },
      { id: "jobOffers", area: "2 / 10 / 4 / 13" },
    ],
    mainArea: "1 / 1 / 4 / 10",
  },
  "/blog/[slug]": {
    railSide: "right",
    rail: [
      { id: "subscribe", area: "1 / 10 / 2 / 13" },
      { id: "aboutMe", area: "2 / 10 / 4 / 13" },
    ],
    mainArea: "1 / 1 / 4 / 10",
  },
};
```

`SatelliteRail` mevcut pathname'e göre manifesti okur, kartları `AnimatePresence` içinde
render eder. Her kartın `key`'i sabit `id`'sidir — bu yüzden sayfa değişse de aynı React
elemanı kalır ve Motion `layout` prop'u konumu animasyonla taşır.

**`id` sabit kalmalı.** `key={`${pathname}-${id}`}` yazarsan kart her sayfada yeniden doğar
ve tüm sistem çöker. Bu, bu projede yapılabilecek en pahalı hatadır.

### 3.4 Kart boyutu

Kart hangi grid alanında olduğunu bilmez; genişliğini `size` prop'undan alır.
Manifest `area` ile birlikte `size` de verir (`sm` | `md` | `lg`).

---

## 4. Render stratejisi

| Route          | Strateji  | Yenileme                         |
| -------------- | --------- | -------------------------------- |
| `/`            | ISR       | 1 saat                           |
| `/hakkimda`    | ISR       | 1 saat (ray Projects kartı için) |
| `/projeler`    | ISR       | 1 saat                           |
| `/blog`        | ISR       | 1 saat                           |
| `/blog/[slug]` | SSG + ISR | `generateStaticParams` + 1 saat  |

Layout'ta GitHub verisi olduğu için hiçbir sayfa tam statik değil; hepsi ISR.
Bu kabul edilebilir: ilk byte hâlâ cache'ten gelir.

Hiçbir sayfa client-side render edilmez. Deck geçişi client'ta olur ama her route'un HTML'i
sunucudan tam gelir.

---

## 5. GitHub veri akışı

Tasarım üç ayrı GitHub verisi istiyor: repo listesi, öne çıkan repo detayı ve profil kartı.
Tek GraphQL sorgusuyla üçü birden gelir.

```graphql
query Portfolio($login: String!) {
  user(login: $login) {
    login
    name
    bio
    avatarUrl(size: 240)
    url
    repositories(
      first: 20
      privacy: PUBLIC
      isFork: false
      orderBy: { field: PUSHED_AT, direction: DESC }
    ) {
      totalCount
      nodes {
        name
        description
        url
        homepageUrl
        stargazerCount
        pushedAt
        isArchived
        openGraphImageUrl
        usesCustomOpenGraphImage
        primaryLanguage {
          name
          color
        }
        repositoryTopics(first: 10) {
          nodes {
            topic {
              name
            }
          }
        }
      }
    }
  }
}
```

```ts
// src/lib/github.ts
export async function getGitHub(): Promise<GitHubData> {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: PORTFOLIO_QUERY,
      variables: { login: env.GITHUB_USERNAME },
    }),
    next: { revalidate: 3600, tags: ["github"] },
  });

  if (!res.ok) return FALLBACK; // asla throw etme
  const parsed = GitHubSchema.safeParse((await res.json()).data?.user);
  return parsed.success ? shape(parsed.data) : FALLBACK;
}
```

**Kurallar:**

- Token yalnızca sunucuda. `NEXT_PUBLIC_` öneki asla.
- Fine-grained token'da yalnızca `Metadata: Read` yeterli — public veri için fazlası gereksiz.
- 403/429 veya şema uyumsuzluğunda `FALLBACK` devreye girer; kart asla boş kalmaz.
- Filtre: `isArchived`, `isFork` ve `portfolio-hidden` topic'li repo'lar elenir.
- Sıralama: `featured-projects.ts` manuel sırası önce, kalanlar `pushedAt` desc.

**Kapak görselleri.** `openGraphImageUrl` her repo için gelir (repo'ya özel görsel yoksa
GitHub otomatik üretir). `next.config.ts`:

```ts
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "opengraph.githubassets.com" },
    { protocol: "https", hostname: "repository-images.githubusercontent.com" },
    { protocol: "https", hostname: "avatars.githubusercontent.com" },
  ],
}
```

**Webhook.** `app/api/revalidate/route.ts` GitHub push webhook'unu alır, `x-hub-signature-256`
imzasını `crypto.timingSafeEqual` ile doğrular, `revalidateTag("github")` çağırır.
İmza doğrulanmadan hiçbir şey yapılmaz.

---

## 6. Blog akışı

`content/blog/*.mdx` → `gray-matter` → Zod → `next-mdx-remote/rsc`.

Eklentiler: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`.
Okuma süresi `reading-time` ile hesaplanır, frontmatter'a yazılmaz.

**Sayfalama** — `/blog?page=N`:

```tsx
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const current = Math.max(1, Number(page) || 1);
  const posts = await getAllPosts();
  const [featured, ...rest] = posts;              // "Last Writing" her sayfada aynı mı?
  const perPage = 3;
  const slice = rest.slice((current - 1) * perPage, current * perPage);
  ...
}
```

**Karar:** "Last Writing" kartı yalnızca 1. sayfada öne çıkan yazıyı gösterir; 2. sayfadan
itibaren o slot listenin devamına dönüşür. Aynı yazıyı her sayfada tekrar göstermek hem
yer israfı hem içerik tekrarıdır.

`current` sınır dışıysa (`page=99`) → `notFound()`. Boş sayfa 200 dönmemeli.

---

## 7. Formlar

Server Action, API route değil — JS kapalıyken de çalışsın ve ek endpoint olmasın.

```ts
// src/app/actions/job-offer.ts
"use server";

export async function sendJobOffer(
  prev: State,
  formData: FormData,
): Promise<State> {
  if (formData.get("company_website")) return { ok: true }; // honeypot
  if (Date.now() - Number(formData.get("ts")) < 2000) return { ok: true };

  if (await isRateLimited())
    return { ok: false, error: "Çok fazla deneme. Bir saat sonra dene." };

  const parsed = JobOfferSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return { ok: false, fieldErrors: parsed.error.flatten().fieldErrors };

  await resend.emails.send({
    /* ... */
  });
  return { ok: true };
}
```

İstemcide `useActionState` + `useFormStatus`. Pending'de buton `disabled` ve "Sending…".

**Dikkat:** form kartları kalıcı raydadır. Form gönderimi sayfa değişimini tetiklememeli;
Server Action zaten route değiştirmez, ama `redirect()` çağırma.

Rate limit: Upstash Redis (ücretsiz katman). Bellek içi `Map` üretimde çalışmaz —
Vercel'de her lambda ayrı bellektir.

---

## 8. Ortam değişkenleri

```bash
# .env.local — asla commit edilmez
GITHUB_TOKEN=
GITHUB_USERNAME=anilgunduz
GITHUB_WEBHOOK_SECRET=
RESEND_API_KEY=
CONTACT_EMAIL=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEXT_PUBLIC_SITE_URL=https://anilgunduz.dev
NEXT_PUBLIC_CAREER_START=2021-09-01T00:00:00Z
```

`src/lib/env.ts` bunları Zod ile parse eder ve **build sırasında** doğrular.
Eksik değişkenle build patlamalı. `.env.example` commit edilir.

---

## 9. Kalite kapıları

```bash
npx tsc --noEmit
npm run lint
npm run build
npx @lhci/cli autorun
```

GitHub Actions'ta PR başına. Kırmızıysa merge yok.
